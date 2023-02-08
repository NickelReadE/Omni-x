import {addDays} from 'date-fns'
import {BigNumber, BigNumberish, ethers} from 'ethers'
import {PendingTxType} from '../../contexts/contract'
import {IBidData, IListingData, IOrder, NFTItem, OrderStatus} from '../../interface/interface'
import {openSnackBar} from '../../redux/reducers/snackBarReducer'
import {collectionsService} from '../../services/collections'
import {MakerOrderWithSignature, TakerOrderWithEncodedParams} from '../../types'
import {
  ContractName,
  CREATOR_FEE,
  formatCurrency,
  getAddressByName,
  getChainNameFromId,
  getConversionRate,
  getCurrencyNameAddress, getDecimals,
  getLayerzeroChainId,
  getProvider,
  isUsdcOrUsdt,
  isWeth,
  parseCurrency,
  PROTOCAL_FEE,
  validateCurrencyName
} from '../../utils/constants'
import {
  decodeFromBytes,
  getCurrencyInstance,
  getCurrencyManagerInstance,
  getERC721Instance,
  getFundManagerInstance,
  getOmnixExchangeInstance,
  getONFTCore721Instance,
  getTransferSelectorNftInstance,
  getLayerZeroEndpointInstance
} from '../../utils/contracts'
import {acceptOrder, postMakerOrder} from '../../utils/makeOrder'
import {serializeMakeOrder, serializeTakeOrder} from '../../utils/utils'

export type TradingCommonData = {
  provider?: any,
  signer?: any,
  address?: string,
  chainId?: number,
  tokenId?: string,
  collectionUrl?: string,
  collectionAddress?: string,
  selectedNFTItem?: NFTItem,
  onRefresh?: () => void
}

export type TradingSpecialData = {
  dispatch?: any,
  switchNetworkAsync?: any,
  addTxToHistories?: any,
  listenONFTEvents?: any,
}

const approve = async (contract: any, owner?: string, spender?: string, amount?: BigNumberish) => {
  const allowance = await contract.allowance(owner, spender)
  if (allowance.lt(BigNumber.from(amount))) {
    return contract.approve(spender, amount)
  }
  return null
}

const approveNft = async (contract: any, owner?: string, operator?: string, tokenId?: BigNumberish) => {
  const isApprovedAll = await contract.isApprovedForAll(owner, operator)
  if (isApprovedAll) return null

  const approvedOperator = await contract.getApproved(tokenId)
  if (approvedOperator == operator) return null

  return await contract.setApprovalForAll(operator, true)
}

// const validateONFT = async (token_address: string, contract_type: string, chainId: number) => {
//   // try {
//   //   if (contract_type === 'ERC721') {
//   //     const ERC721Instance = getERC721Instance(token_address, chainId, null)
//   //     const isERC721 = await ERC721Instance.supportsInterface(ERC721_INTERFACE_ID)
//   //     const isONFTERC721 = await ERC721Instance.supportsInterface(ONFT_CORE_INTERFACE_ID)

//   //     console.log('--isONFTERC721--', isERC721, isONFTERC721)
//   //     return !!(isERC721 && isONFTERC721)
//   //   } else if (contract_type === 'ERC1155') {
//   //     const ERC1155Instance = getERC1155Instance(token_address, chainId, null)
//   //     const isERC1155 = await ERC1155Instance.supportsInterface(ERC1155_INTERFACE_ID)
//   //     const isONFTERC1155 = await ERC1155Instance.supportsInterface(ONFT1155_CORE_INTERFACE_ID)
//   //     return !!(isERC1155 && isONFTERC1155)
//   //   }
//   //   return false
//   // } catch (e) {
//   //   console.error(e)
//   //   return false
//   // }
// }

const checkValid = async (currency: string, price: string, chainId: number, signer: any) => {
  if (currency===''){
    throw new Error('Current Currency is not supported in this network')
  }

  const currencyMangerContract = getCurrencyManagerInstance(chainId, signer)
  if (currencyMangerContract===null){
    throw new Error('This network doesn\'t support currencies')
  }

  if (!await currencyMangerContract.isCurrencyWhitelisted(currency)) {
    throw new Error(`Currency(${currency}) is not whitelisted in this network`)
  }

  if (Number(price) === 0) {
    throw new Error('Please input the correct price')
  }

  return true
}

const updateOrderStatus = async (order: IOrder, status: OrderStatus) => {
  await acceptOrder(
    order.hash,
    Number(order.token_id),
    status
  )
}

export const doListingApprove = async (
  check_network: boolean,
  common_data: TradingCommonData,
  special_data: TradingSpecialData,
) => {
  if (!common_data.selectedNFTItem?.chain_id) throw new Error('Invalid NFT chain')
  if (!common_data.chainId) throw new Error('Please connect to your wallet')
  if (!common_data.collectionAddress) throw new Error('Invalid collection')
  if (common_data.selectedNFTItem?.chain_id != common_data.chainId) {
    if (special_data.switchNetworkAsync) {
      await special_data.switchNetworkAsync(common_data.selectedNFTItem?.chain_id)
      throw new Error('Network changed')
    }
    else {
      throw new Error(`Please switch network to ${getChainNameFromId(common_data.selectedNFTItem?.chain_id)}`)
    }
  }

  if (check_network) {
    return
  }

  const transferSelector = getTransferSelectorNftInstance(common_data.chainId, common_data.signer)
  const transferManagerAddr = await transferSelector.checkTransferManagerForToken(common_data.collectionAddress)
  const nftContract = getERC721Instance(common_data.collectionAddress, common_data.chainId, common_data.signer)
  return await approveNft(nftContract, common_data.address, transferManagerAddr, common_data.tokenId)
}

export const doListingConfirm = async (listing_data: IListingData, common_data: TradingCommonData) => {
  if (!common_data.selectedNFTItem?.chain_id) throw new Error('Invalid NFT chain')
  if (!common_data.chainId) throw new Error('Please connect to your wallet')
  if (!common_data.collectionAddress || !common_data.collectionUrl) throw new Error('Invalid collection')
  if (common_data.selectedNFTItem?.chain_id != common_data.chainId) {
    throw new Error(`Please switch network to ${getChainNameFromId(common_data.selectedNFTItem?.chain_id)}`)
  }

  const amount = ethers.utils.parseUnits('1', 0)
  const protocalFees = ethers.utils.parseUnits(PROTOCAL_FEE.toString(), 2)
  const creatorFees = ethers.utils.parseUnits(CREATOR_FEE.toString(), 2)
  const lzChainId = getLayerzeroChainId(common_data.chainId)
  const price = parseCurrency(listing_data.price.toString(), common_data.chainId, listing_data.currencyName) // ethers.utils.parseEther(listing_data.price.toString())
  const startTime = Date.now()
  const royaltyInfo = ethers.utils.defaultAbiCoder.encode(['address', 'uint256'], [ethers.constants.AddressZero, 0])
  await postMakerOrder(
    common_data.signer,
    true,
    common_data.collectionAddress,
    getAddressByName('Strategy', common_data.chainId),
    amount,
    price,
    protocalFees,
    creatorFees,
    getAddressByName(listing_data.currencyName as ContractName, common_data.chainId),
    {
      tokenId: common_data.tokenId,
      startTime,
      endTime: addDays(startTime, listing_data.period).getTime(),
      params: {
        values: [lzChainId, royaltyInfo],
        types: ['uint16', 'bytes'],
      },
    },
    getChainNameFromId(common_data.chainId),
    common_data.chainId,
    true,
    common_data.collectionUrl,
  )
}

export const doListingDone = (common_data: TradingCommonData) => {
  if (common_data.onRefresh) common_data.onRefresh()
}

export const doBuyApprove = async (order: IOrder, common_data: TradingCommonData, special_data: TradingSpecialData) => {
  if (!order) throw new Error('Not listed')
  if (!common_data.chainId) throw new Error('Please connect to your wallet')

  const approveTxs = []

  const currencyName = getCurrencyNameAddress(order.currency) as ContractName
  const newCurrencyName = validateCurrencyName(currencyName, common_data.chainId)

  if (!newCurrencyName) {
    throw new Error(`Not supported currency ${currencyName}`)
  }

  const currencyAddress = getAddressByName(newCurrencyName, common_data.chainId)
  const formattedPrice = formatCurrency(order?.price || 0, order.chain_id, currencyName)
  const parsedPrice = parseCurrency(formattedPrice, common_data.chainId, newCurrencyName)

  await checkValid(currencyAddress, formattedPrice, common_data.chainId, common_data.signer)

  if (isWeth(currencyAddress)) {
    const balance = await common_data.signer.getBalance()
    if (balance.lt(parsedPrice)) {
      const errMessage = 'Not enough balance'
      special_data.dispatch(openSnackBar({ message: errMessage, status: 'warning' }))
      throw new Error(errMessage)
    }
  }
  else {
    const omni = getCurrencyInstance(currencyAddress, common_data.chainId, common_data.signer)

    if (!omni) {
      throw new Error('Could not find the currency')
    }

    {
      const balance = await omni.balanceOf(common_data.address)
      if (balance.lt(parsedPrice)) {
        const errMessage = 'Not enough balance'
        special_data.dispatch(openSnackBar({ message: errMessage, status: 'warning' }))
        throw new Error(errMessage)
      }
    }

    const buy_price = parsedPrice
    approveTxs.push(await approve(omni, common_data.address, getAddressByName('FundManager', common_data.chainId), buy_price))

    if (isUsdcOrUsdt(order?.currency)) {
      approveTxs.push(await approve(omni, common_data.address, getAddressByName('StargatePoolManager', common_data.chainId), buy_price))
    }
  }

  return approveTxs.filter(Boolean)
}

export const doBuyConfirm = async (order: IOrder, common_data: TradingCommonData, special_data: TradingSpecialData) => {
  if (!common_data.selectedNFTItem) throw new Error('Invalid NFT data')
  if (!common_data.chainId) throw new Error('Not connected to the wallet')

  console.log(order, common_data, special_data)

  const isONFTCore = false // await validateONFT(order?.collectionAddress, common_data.selectedNFTItem.contract_type || 'ERC721', order.chain_id)
  const orderChainId = order.chain_id
  const blockNumber = await common_data.provider.getBlockNumber()
  const targetProvider = getProvider(orderChainId)
  const targetBlockNumber = await targetProvider.getBlockNumber()

  const lzChainId = getLayerzeroChainId(common_data.chainId)
  const currencyName = getCurrencyNameAddress(order.currency) as ContractName
  const newCurrencyName = validateCurrencyName(currencyName, common_data.chainId)

  if (!newCurrencyName) {
    throw new Error(`Not supported currency ${currencyName}`)
  }

  const currencyAddress = getAddressByName(newCurrencyName, common_data.chainId)
  const formattedPrice = formatCurrency(order?.price || 0, order.chain_id, currencyName)
  const parsedPrice = parseCurrency(formattedPrice,  common_data.chainId, newCurrencyName)

  await checkValid(currencyAddress, formattedPrice, common_data.chainId, common_data.signer)

  const omni = getCurrencyInstance(currencyAddress, common_data.chainId, common_data.signer)
  if (!omni) {
    throw new Error('Could not find the currency')
  }

  const omnixExchange = getOmnixExchangeInstance(common_data.chainId, common_data.signer)
  const makerAsk : MakerOrderWithSignature = {
    isOrderAsk: order.is_order_ask,
    signer: order?.signer,
    collection: order?.collection_address,
    price: order?.price,
    tokenId: order?.token_id,
    amount: order?.amount,
    strategy: order?.strategy,
    currency: order?.currency,
    nonce: order?.nonce,
    startTime: order?.start_time,
    endTime: order?.end_time,
    minPercentageToAsk: order?.min_percentage_to_ask,
    params: ethers.utils.defaultAbiCoder.encode(['uint16', 'bytes'], order?.params),
    signature: order?.signature
  }

  const takerBid : TakerOrderWithEncodedParams = {
    isOrderAsk: false,
    taker: common_data.address || '0x',
    price: parsedPrice,
    tokenId: order?.token_id || '0',
    minPercentageToAsk: order?.min_percentage_to_ask || '0',
    params: ethers.utils.defaultAbiCoder.encode([
      'uint16',
      'address',
      'address',
      'address',
      'uint256',
    ], [
      lzChainId,
      currencyAddress,
      common_data.collectionAddress,
      getAddressByName('Strategy', common_data.chainId),
      getConversionRate(order.chain_id, currencyName, common_data.chainId, newCurrencyName)
    ])
  }


  serializeMakeOrder(makerAsk)
  serializeTakeOrder(takerBid)

  const targetLzEndpoint = getLayerZeroEndpointInstance(orderChainId, targetProvider)
  const [destCrossFee,] = await targetLzEndpoint.estimateFees(
    lzChainId,
    omnixExchange.address,
    ethers.utils.defaultAbiCoder.encode(['uint8', 'uint256', 'uint8'], [0, 0, 0]),
    false,
    ethers.utils.solidityPack(['uint16', 'uint256', 'uint256', 'address'], [2, 250000, 0, getAddressByName('OmnixExchange', orderChainId)])
  )

  const [omnixFee, currencyFee, nftFee] = await omnixExchange.getLzFeesForTrading(takerBid, makerAsk, destCrossFee)
  const lzFee = omnixFee.add(currencyFee).add(nftFee)

  console.log('---lzFee---',
    ethers.utils.formatEther(omnixFee),
    ethers.utils.formatEther(currencyFee),
    ethers.utils.formatEther(nftFee),
    ethers.utils.formatEther(lzFee),
    ethers.utils.formatEther(destCrossFee)
  )

  let tx = null
  if (isWeth(currencyAddress)) {
    const balance = await common_data.provider?.getBalance(common_data.address)
    const payPrice = lzFee.add(takerBid.price)
    if (balance.lt(payPrice)) {
      const errMessage = `Not enough native balance ${ethers.utils.formatEther(payPrice)}`
      special_data.dispatch(openSnackBar({ message: errMessage, status: 'warning' }))
      throw new Error(errMessage)
    }

    tx = await omnixExchange.connect(common_data.signer).matchAskWithTakerBidUsingETHAndWETH(destCrossFee, takerBid, makerAsk, { value: payPrice })
  }
  else {
    {
      const balance = await common_data.provider?.getBalance(common_data.address)
      if (balance.lt(lzFee)) {
        const errMessage = `Not enough native balance ${ethers.utils.formatEther(lzFee)}`
        special_data.dispatch(openSnackBar({ message: errMessage, status: 'warning' }))
        throw new Error(errMessage)
      }
    }

    {
      const balance = await omni.balanceOf(common_data.address)
      if (balance.lt(takerBid.price)) {
        const errMessage = 'Not enough balance'
        special_data.dispatch(openSnackBar({ message: errMessage, status: 'warning' }))
        throw new Error(errMessage)
      }
    }

    tx = await omnixExchange.connect(common_data.signer).matchAskWithTakerBid(destCrossFee, takerBid, makerAsk, { value: lzFee })
  }

  let targetCollectionAddress = ''
  if (isONFTCore) {
    const onftCoreInstance = getONFTCore721Instance(order.collection_address, orderChainId, null)
    const remoteAddresses = await onftCoreInstance.getTrustedRemote(getLayerzeroChainId(common_data.chainId))
    targetCollectionAddress = decodeFromBytes(remoteAddresses)
  }

  // PendingTxType
  // senderChainId: chain id of seller
  // senderAddress: collection address of seller
  // senderBlockNumber: block of seller chain
  // destTxHash: tx hash of buyer
  // targetChainId: chain id of buyer
  // targetAddress: collection address of buyer
  // targetBlockNumber: block of buyer chain
  const pendingTx: PendingTxType = {
    type: 'buy',
    senderChainId: orderChainId,
    senderAddress: order.collection_address,
    senderBlockNumber: targetBlockNumber,
    destTxHash: tx.hash,
    targetChainId: common_data.chainId,
    targetAddress: targetCollectionAddress,
    isONFTCore,
    contractType: common_data.selectedNFTItem.contract_type || 'ERC721',
    nftItem: common_data.selectedNFTItem,
    targetBlockNumber: blockNumber,
    itemName: common_data.selectedNFTItem.name,
    lastTxAvailable: orderChainId !== common_data.chainId && isONFTCore,
    colUrl: common_data.collectionUrl
  }

  const txIdx = special_data.addTxToHistories(pendingTx)
  await special_data.listenONFTEvents(pendingTx, txIdx)

  return tx
}

export const doBuyComplete = async (order: IOrder, common_data: TradingCommonData) => {
  if (!common_data.collectionUrl) throw new Error('Invalid Collection')

  await updateOrderStatus(order, 'EXECUTED')
  await collectionsService.updateCollectionNFTChainID(common_data.collectionUrl, Number(common_data.tokenId), Number(common_data.chainId))
}

export const doBuyDone = (common_data: TradingCommonData) => {
  if (common_data.onRefresh) common_data.onRefresh()
}

export const doBidApprove = async (bid_data: IBidData, common_data: TradingCommonData, special_data: TradingSpecialData) => {
  if (!common_data.chainId) {
    throw new Error('Please connect to your wallet')
  }

  const currency = getAddressByName(bid_data.currencyName as ContractName, common_data.chainId)
  const decimal = getDecimals(common_data.chainId, bid_data.currencyName)
  const price = ethers.utils.parseUnits(bid_data.price.toString(), decimal)

  await checkValid(currency, price.toString(), common_data.chainId, common_data.signer)

  const omni = getCurrencyInstance(currency, common_data.chainId, common_data.signer)

  if (!omni) {
    throw new Error('Could not find the currency')
  }

  {
    const balance = await omni.balanceOf(common_data.address)
    if (balance.lt(price)) {
      const errMessage = 'Not enough balance'
      special_data.dispatch(openSnackBar({ message: errMessage, status: 'warning' }))
      throw new Error(errMessage)
    }
  }

  const approveTxs = []
  approveTxs.push(await approve(omni, common_data.address, getAddressByName('FundManager', common_data.chainId), price))
  if (isUsdcOrUsdt(currency)) {
    approveTxs.push(await approve(omni, common_data.address, getAddressByName('StargatePoolManager', common_data.chainId), price))
  }

  return approveTxs.filter(Boolean)
}

export const doBidConfirm = async (bid_data: IBidData, common_data: TradingCommonData) => {
  if (!common_data.chainId) throw new Error('Please connect to your wallet')
  if (!common_data.collectionAddress || !common_data.collectionUrl) throw new Error('Invalid collection')

  const lzChainId = getLayerzeroChainId(common_data.chainId)

  const currency = getAddressByName(bid_data.currencyName as ContractName, common_data.chainId)
  const decimal = getDecimals(common_data.chainId, bid_data.currencyName)
  const price = ethers.utils.parseUnits(bid_data.price.toString(), decimal)
  const protocalFees = ethers.utils.parseUnits(PROTOCAL_FEE.toString(), 2)
  const creatorFees = ethers.utils.parseUnits(CREATOR_FEE.toString(), 2)
  const isCollectionOffer = !common_data.tokenId
  const royaltyInfo = ethers.utils.defaultAbiCoder.encode(['address', 'uint256'], [ethers.constants.AddressZero, 0])

  await checkValid(currency, price.toString(), common_data.chainId, common_data.signer)

  await postMakerOrder(
    common_data.signer,
    false,
    common_data.collectionAddress,
    getAddressByName(isCollectionOffer ? 'StrategyForCollection' : 'Strategy', common_data.chainId),
    1,
    price,
    protocalFees,
    creatorFees,
    currency,
    {
      tokenId: common_data.tokenId,
      params: {
        values: [lzChainId, royaltyInfo],
        types: ['uint16', 'bytes'],
      },
    },
    getChainNameFromId(common_data.chainId),
    common_data.chainId,
    true,
    common_data.collectionUrl
  )
}

export const doBidDone = (common_data: TradingCommonData) => {
  if (common_data.onRefresh) common_data.onRefresh()
}

export const doAcceptApprove = async (check_network: boolean, common_data: TradingCommonData, special_data: TradingSpecialData) => {
  if (!common_data.selectedNFTItem?.chain_id) throw new Error('Invalid NFT chain')
  if (!common_data.chainId) throw new Error('Please connect to your wallet')
  if (!common_data.collectionAddress) throw new Error('Invalid collection')
  if (common_data.selectedNFTItem?.chain_id != common_data.chainId) {
    if (special_data.switchNetworkAsync) {
      await special_data.switchNetworkAsync(common_data.selectedNFTItem?.chain_id)
      throw new Error('Network changed')
    }
    else {
      throw new Error(`Please switch network to ${getChainNameFromId(common_data.selectedNFTItem?.chain_id)}`)
    }
  }

  if (check_network) {
    return
  }

  const transferSelector = getTransferSelectorNftInstance(common_data.chainId, common_data.signer)
  const transferManagerAddr = await transferSelector.checkTransferManagerForToken(common_data.collectionAddress)
  const nftContract = getERC721Instance(common_data.collectionAddress, common_data.chainId, common_data.signer)
  return await approveNft(nftContract, common_data.address, transferManagerAddr, common_data.tokenId)
}

export const doAcceptConfirm = async (bid_order: IOrder, common_data: TradingCommonData, special_data: TradingSpecialData) => {
  if (!common_data.selectedNFTItem?.chain_id) throw new Error('Invalid NFT chain')
  if (!common_data.chainId) throw new Error('Please connect to your wallet')
  if (!common_data.collectionAddress) throw new Error('Invalid collection')
  if (common_data.selectedNFTItem?.chain_id != common_data.chainId) {
    throw new Error(`Please switch network to ${getChainNameFromId(common_data.selectedNFTItem?.chain_id)}`)
  }

  const isONFTCore = false // await validateONFT(bid_order.collectionAddress, common_data.selectedNFTItem.contract_type || 'ERC721', bid_order.chain_id)
  const orderChainId = bid_order.chain_id
  const blockNumber = await common_data.provider.getBlockNumber()
  const targetProvider = getProvider(orderChainId)
  const targetBlockNumber = await targetProvider.getBlockNumber()

  const lzChainId = getLayerzeroChainId(common_data.chainId)
  const omnixExchange = getOmnixExchangeInstance(common_data.chainId, common_data.signer)
  const makerBid : MakerOrderWithSignature = {
    isOrderAsk: false,
    signer: bid_order.signer,
    collection: bid_order.collection_address,
    price: bid_order.price,
    tokenId: bid_order.token_id,
    amount: bid_order.amount,
    strategy: bid_order.strategy,
    currency: bid_order.currency,
    nonce: bid_order.nonce,
    startTime: bid_order.start_time,
    endTime: bid_order.end_time,
    minPercentageToAsk: bid_order.min_percentage_to_ask,
    params: ethers.utils.defaultAbiCoder.encode(['uint16', 'bytes'], bid_order.params),
    signature: bid_order.signature
  }

  const currencyName = getCurrencyNameAddress(bid_order.currency) as ContractName
  const newCurrencyName = validateCurrencyName(currencyName, common_data.chainId)

  if (!newCurrencyName) {
    throw new Error(`Not supported currency ${currencyName}`)
  }

  const currencyAddress = getAddressByName(newCurrencyName, common_data.chainId)
  const formattedPrice = formatCurrency(bid_order.price, bid_order.chain_id, currencyName)
  const parsedPrice = parseCurrency(formattedPrice, common_data.chainId, newCurrencyName)

  const isCollectionOffer = !bid_order.token_id || Number(bid_order.token_id) === 0
  const takerAsk : TakerOrderWithEncodedParams = {
    isOrderAsk: true,
    taker: common_data.address || '0x',
    price: parsedPrice,
    tokenId: common_data.tokenId || '0',
    minPercentageToAsk: bid_order.min_percentage_to_ask || '0',
    params: ethers.utils.defaultAbiCoder.encode([
      'uint16',
      'address',
      'address',
      'address',
      'uint256'
    ], [
      lzChainId,
      currencyAddress,
      common_data.collectionAddress,
      getAddressByName(isCollectionOffer ? 'StrategyForCollection' : 'Strategy', common_data.chainId),
      getConversionRate(bid_order.chain_id, currencyName, common_data.chainId, newCurrencyName)
    ])
  }

  const targetFundManager = getFundManagerInstance(orderChainId)
  const targetLzEndpoint = getLayerZeroEndpointInstance(orderChainId, targetProvider)
  const destAirdrop = await targetFundManager.lzFeeTransferCurrency(makerBid.currency, takerAsk.taker, takerAsk.price, getLayerzeroChainId(orderChainId), lzChainId)
  const [destCrossFee,] = await targetLzEndpoint.estimateFees(
    lzChainId,
    omnixExchange.address,
    ethers.utils.defaultAbiCoder.encode(['uint8', 'uint256', 'uint8'], [0, 0, 0]),
    false,
    ethers.utils.solidityPack(['uint16', 'uint256', 'uint256', 'address'], [2, 250000, 0, getAddressByName('OmnixExchange', orderChainId)])
  )

  const destFee = destAirdrop.add(destCrossFee)
  console.log('-airdrop-', ethers.utils.formatEther(destAirdrop))
  const [omnixFee, currencyFee, nftFee] = await omnixExchange.getLzFeesForTrading(takerAsk, makerBid, destFee)
  const lzFee = omnixFee.add(currencyFee).add(nftFee)

  console.log('---lzFee---',
    ethers.utils.formatEther(omnixFee),
    ethers.utils.formatEther(currencyFee),
    ethers.utils.formatEther(nftFee),
    ethers.utils.formatEther(lzFee),
    ethers.utils.formatEther(destAirdrop)
  )

  {
    const balance = await common_data.provider?.getBalance(common_data.address)
    if (balance.lt(lzFee)) {
      const errMessage = `Not enough native balance ${ethers.utils.formatEther(lzFee)}`
      special_data.dispatch(openSnackBar({ message: errMessage, status: 'warning' }))
      throw new Error(errMessage)
    }
  }

  const tx = await omnixExchange.connect(common_data.signer).matchBidWithTakerAsk(destFee, takerAsk, makerBid, { value: lzFee })

  // PendingTxType
  // txHash: tx hash of seller
  // senderChainId: chain id of seller
  // senderAddress: collection address of seller
  // sellerBlockNumber: block of buyer chain
  // targetChainId: chain id of buyer
  // targetAddress: collection address of buyer
  // targetBlockNumber: block of buyer chain
  const pendingTx: PendingTxType = {
    type: 'accept',
    txHash: tx.hash,
    senderChainId: common_data.chainId,
    senderAddress: currencyAddress,
    senderBlockNumber: blockNumber,
    targetChainId: orderChainId,
    targetAddress: bid_order.currency,
    targetBlockNumber: targetBlockNumber,
    isONFTCore,
    contractType: common_data.selectedNFTItem.contract_type || 'ERC721',
    nftItem: common_data.selectedNFTItem,
    itemName: common_data.selectedNFTItem.name,
    lastTxAvailable: false,
    colUrl: common_data.collectionUrl
  }

  const txIdx = special_data.addTxToHistories(pendingTx)
  await special_data.listenONFTEvents(pendingTx, txIdx)

  return tx
}

export const doAcceptComplete = async (bid_order: IOrder, common_data: TradingCommonData) => {
  if (!common_data.collectionUrl) throw new Error('Invalid collection')

  await updateOrderStatus(bid_order, 'EXECUTED')
  await collectionsService.updateCollectionNFTChainID(common_data.collectionUrl, Number(common_data.tokenId), Number(common_data.chainId))
}

export const doAcceptDone = (common_data: TradingCommonData) => {
  if (common_data.onRefresh) common_data.onRefresh()
}
