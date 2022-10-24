import { addDays } from 'date-fns'
import { BigNumber, BigNumberish, ethers } from 'ethers'
import { Dispatch, SetStateAction, useState } from 'react'
import { useDispatch } from 'react-redux'
import { IBidData, IGetOrderRequest, IListingData, IOrder, NFTItem, OrderStatus } from '../interface/interface'
import { getLastSaleOrders, getOrders } from '../redux/reducers/ordersReducer'
import { openSnackBar } from '../redux/reducers/snackBarReducer'
import { collectionsService } from '../services/collections'
import { MakerOrderWithSignature, TakerOrderWithEncodedParams } from '../types'
import { ContractName, CREATOR_FEE, getAddressByName, getConversionRate, getCurrencyNameAddress, getLayerzeroChainId, getProvider, isUsdcOrUsdt, parseCurrency, PROTOCAL_FEE, validateCurrencyName } from '../utils/constants'
import {
  decodeFromBytes,
  getCurrencyInstance,
  getCurrencyManagerInstance,
  getERC721Instance,
  getOmnixExchangeInstance,
  getONFTCore721Instance,
  getTransferSelectorNftInstance
} from '../utils/contracts'
import { acceptOrder, postMakerOrder } from '../utils/makeOrder'
import { getChainNameFromId } from '../utils/constants'
import { useMemo } from 'react'
import useProgress from './useProgress'
import { PendingTxType } from '../contexts/contract'
import useContract from './useContract'
import useWallet from './useWallet'

export type TradingFunction = {
  openSellDlg: boolean,
  openBidDlg: boolean,
  openBuyDlg: boolean,
  setOpenSellDlg: Dispatch<SetStateAction<boolean>>,
  setOpenBidDlg: Dispatch<SetStateAction<boolean>>,
  setOpenBuyDlg: Dispatch<SetStateAction<boolean>>,
  getListOrders: () => void,
  getBidOrders: () => void,
  getLastSaleOrder: () => void,
  updateOrderStatus: (order: IOrder, status: OrderStatus) => Promise<void>,
  onListingApprove: (isAuction: boolean) => Promise<any>,
  onListingConfirm: (listingData: IListingData) => Promise<any>,
  onListingDone: () => void,
  onBuyApprove: (order?: IOrder) => Promise<any>,
  onBuyConfirm: (order?: IOrder) => Promise<any>,
  onBuyComplete: (order?: IOrder) => Promise<void>,
  onBuyDone: () => void,
  onBidApprove: (bidData: IBidData) => Promise<any>,
  onBidConfirm: (bidData: IBidData) => Promise<void>,
  onBidDone: () => void,
  onAccept: (bidOrder: IOrder) => Promise<void>,
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

const validateONFT = async (token_address: string, contract_type: string, chain_id: number) => {
  // at this moment, we don't enable ONFT trading
  return false
  // try {
  //   if (contract_type === 'ERC721') {
  //     const ERC721Instance = getERC721Instance(token_address, chain_id, null)
  //     const isERC721 = await ERC721Instance.supportsInterface(ERC721_INTERFACE_ID)
  //     const isONFTERC721 = await ERC721Instance.supportsInterface(ONFT_CORE_INTERFACE_ID)

  //     console.log('--isONFTERC721--', isERC721, isONFTERC721)
  //     return !!(isERC721 && isONFTERC721)
  //   } else if (contract_type === 'ERC1155') {
  //     const ERC1155Instance = getERC1155Instance(token_address, chain_id, null)
  //     const isERC1155 = await ERC1155Instance.supportsInterface(ERC1155_INTERFACE_ID)
  //     const isONFTERC1155 = await ERC1155Instance.supportsInterface(ONFT1155_CORE_INTERFACE_ID)
  //     return !!(isERC1155 && isONFTERC1155)
  //   }
  //   return false
  // } catch (e) {
  //   console.error(e)
  //   return false
  // }
}

const useTrading = ({
  provider,
  signer,
  address,
  collection_name,
  collection_address,
  order_collection_address,
  owner,
  owner_collection_chain,
  owner_collection_chain_id,
  token_id,
  selectedNFTItem
}: any): TradingFunction => {
  const { chainId, chainName } = useWallet()
  const [openSellDlg, setOpenSellDlg] = useState(false)
  const [openBidDlg, setOpenBidDlg] = useState(false)
  const [openBuyDlg, setOpenBuyDlg] = useState(false)

  const dispatch = useDispatch()
  const { addTxToHistories } = useProgress()
  const { listenONFTEvents } = useContract()

  collection_name = useMemo(() => {
    if (collection_name) {
      return collection_name = collection_name.replace(' ','_').toLowerCase()
    }
  }, [collection_name])

  const checkValid = async (currency: string, price: string, chainId: number) => {
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
      throw new Error(`Please input the correct price`)
    }

    const currencyContract = getCurrencyInstance(currency, chainId, signer)
    const balance = await currencyContract?.balanceOf(address)

    return true
  }

  const getListOrders = () => {
    const request: IGetOrderRequest = {
      isOrderAsk: true,
      collection: order_collection_address,
      tokenId: token_id,
      signer: owner,
      startTime: Math.floor(Date.now() / 1000).toString(),
      endTime: Math.floor(Date.now() / 1000).toString(),
      status: ['VALID'],
      sort: 'NEWEST'
    }
    dispatch(getOrders(request) as any)
  }

  const getBidOrders = () => {
    const bidRequest: IGetOrderRequest = {
      isOrderAsk: false,
      collection: order_collection_address,
      tokenId: token_id,
      // startTime: Math.floor(Date.now() / 1000).toString(),
      // endTime: Math.floor(Date.now() / 1000).toString(),
      status: ['VALID'],
      sort: 'PRICE_ASC'
    }
    dispatch(getOrders(bidRequest) as any)
  }
  const getLastSaleOrder = () => {
    const excutedRequest: IGetOrderRequest = {
      collection: order_collection_address,
      tokenId: token_id,
      status: ['EXECUTED'],
      sort: 'UPDATE_NEWEST'
    }
    dispatch(getLastSaleOrders(excutedRequest) as any)
  }

  const updateOrderStatus = async (order: IOrder, status: OrderStatus) => {
    await acceptOrder(
      order.hash,
      Number(order.tokenId),
      status
    )
  }

  const onListingApprove = async (isAuction: boolean) => {
    if (owner_collection_chain_id != chainId || !chainId) {
      throw new Error('Please switch network to ${owner_collection_chain}')
    }

    if (!isAuction) {
      const transferSelector = getTransferSelectorNftInstance(chainId, signer)
      const transferManagerAddr = await transferSelector.checkTransferManagerForToken(collection_address)
      const nftContract = getERC721Instance(collection_address, chainId, signer)
      const tx = await approveNft(nftContract, address, transferManagerAddr, token_id)
      return tx
    }
    return null
  }

  const onListingConfirm = async (listingData: IListingData) => {
    if (owner_collection_chain_id != chainId) {
      throw new Error(`Please switch network to ${owner_collection_chain}`)
    }
    if (!chainId || !chainName) {
      throw new Error('Please connect to your wallet')
    }

    const amount = ethers.utils.parseUnits('1', 0)
    const protocalFees = ethers.utils.parseUnits(PROTOCAL_FEE.toString(), 2)
    const creatorFees = ethers.utils.parseUnits(CREATOR_FEE.toString(), 2)
    const lzChainId = getLayerzeroChainId(chainId)
    const price = parseCurrency(listingData.price.toString(), listingData.currencyName) // ethers.utils.parseEther(listingData.price.toString())
    const startTime = Date.now()

    await postMakerOrder(
      signer as any,
      true,
      collection_address,
      getAddressByName('Strategy', chainId),
      amount,
      price,
      protocalFees,
      creatorFees,
      getAddressByName(listingData.currencyName as ContractName, chainId),
      {
        tokenId: token_id,
        startTime,
        endTime: addDays(startTime, listingData.period).getTime(),
        params: {
          values: [lzChainId],
          types: ['uint16'],
        },
      },
      chainName,
      chainId,
      true,
      collection_name,
    )

    await collectionsService.updateCollectionNFTListPrice(collection_name, token_id, listingData.price)
  }

  const onListingDone = () => {
    getListOrders()
  }

  const onBuyApprove = async (order?: IOrder) => {
    if (!order) {
      throw new Error('Not listed')
    }

    if (!chainId) {
      throw new Error('Please connect to your wallet')
    }

    const approveTxs = []

    const currencyName = getCurrencyNameAddress(order.currencyAddress) as ContractName
    const newCurrencyName = validateCurrencyName(currencyName, chainId)
    const currencyAddress = getAddressByName(newCurrencyName, chainId)
    
    await checkValid(currencyAddress, order?.price, chainId)

    const omni = getCurrencyInstance(currencyAddress, chainId, signer)

    if (!omni) {
      throw new Error('Could not find the currency')
    }

    const buy_price = order?.price
    approveTxs.push(await approve(omni, address, getAddressByName('FundManager', chainId), buy_price))

    if (isUsdcOrUsdt(order?.currencyAddress)) {
      approveTxs.push(await approve(omni, address, getAddressByName('StargatePoolManager', chainId), buy_price))
    }

    return approveTxs.filter(Boolean)
  }

  const onBuyConfirm = async (order?: IOrder) => {
    if (!order) {    
      throw new Error('Not listed')
    }
    if (!chainId || !chainName) throw new Error('Not connected to the wallet')

    const isONFTCore = await validateONFT(order?.collectionAddress, selectedNFTItem.contract_type || 'ERC721', order.chain_id)
    const orderChainId = order.chain_id
    const blockNumber = await provider.getBlockNumber()
    const targetProvier = getProvider(orderChainId)
    const targetBlockNumber = await targetProvier.getBlockNumber()

    const lzChainId = getLayerzeroChainId(chainId)
    const currencyName = getCurrencyNameAddress(order.currencyAddress) as ContractName
    const newCurrencyName = validateCurrencyName(currencyName, chainId)
    const currencyAddress = getAddressByName(newCurrencyName, chainId)

    await checkValid(currencyAddress, order?.price, chainId)

    const omni = getCurrencyInstance(currencyAddress, chainId, signer)
    if (!omni) {
      throw new Error('Could not find the currency')
    }

    const omnixExchange = getOmnixExchangeInstance(chainId, signer)
    const makerAsk : MakerOrderWithSignature = {
      isOrderAsk: order.isOrderAsk,
      signer: order?.signer,
      collection: order?.collectionAddress,
      price: order?.price,
      tokenId: order?.tokenId,
      amount: order?.amount,
      strategy: order?.strategy,
      currency: order?.currencyAddress,
      nonce: order?.nonce,
      startTime: order?.startTime,
      endTime: order?.endTime,
      minPercentageToAsk: order?.minPercentageToAsk,
      params: ethers.utils.defaultAbiCoder.encode(['uint16'], order?.params),
      signature: order?.signature
    }

    const takerBid : TakerOrderWithEncodedParams = {
      isOrderAsk: false,
      taker: address || '0x',
      price: order?.price || '0',
      tokenId: order?.tokenId || '0',
      minPercentageToAsk: order?.minPercentageToAsk || '0',
      params: ethers.utils.defaultAbiCoder.encode([
        'uint16',
        'address',
        'address',
        'address',
        'uint256',
      ], [
        lzChainId,
        currencyAddress,
        collection_address,
        getAddressByName('Strategy', chainId),
        getConversionRate(currencyName, newCurrencyName)
      ])
    }

    const [omnixFee, currencyFee, nftFee] = await omnixExchange.connect(signer as any).getLzFeesForTrading(takerBid, makerAsk)
    const lzFee = omnixFee.add(currencyFee).add(nftFee)
    console.log('---lzFee---', 
      ethers.utils.formatEther(omnixFee),
      ethers.utils.formatEther(currencyFee),
      ethers.utils.formatEther(nftFee),
      ethers.utils.formatEther(lzFee)
    )
    const balance = await provider?.getBalance(address!)
    if (balance.lt(lzFee)) {
      throw new Error(`Not enough balance ${ethers.utils.formatEther(lzFee)}`)
    }

    const tx = await omnixExchange.connect(signer as any).matchAskWithTakerBid(takerBid, makerAsk, { value: lzFee })
    
    let targetCollectionAddress = ''
    if (isONFTCore) {
      const onftCoreInstance = getONFTCore721Instance(order.collectionAddress, orderChainId, null)
      const remoteAddresses = await onftCoreInstance.getTrustedRemote(getLayerzeroChainId(chainId))
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
      senderAddress: order.collectionAddress,
      senderBlockNumber: targetBlockNumber,
      destTxHash: tx.hash,
      targetChainId: chainId,
      targetAddress: targetCollectionAddress,
      isONFTCore,
      contractType: selectedNFTItem.contract_type || 'ERC721',
      nftItem: selectedNFTItem,
      targetBlockNumber: blockNumber,
      itemName: selectedNFTItem.name,
      lastTxAvailable: orderChainId !== chainId && isONFTCore
    }
    const historyIndex = addTxToHistories(pendingTx)
    await listenONFTEvents(pendingTx, historyIndex)

    return tx
  }

  const onBuyComplete = async (order?: IOrder) => {
    if (!order) {
      dispatch(openSnackBar({ message: 'Not listed', status: 'warning' }))
      return
    }

    await updateOrderStatus(order, 'EXECUTED')

    await collectionsService.updateCollectionNFTChainID(collection_name, token_id, Number(chainId))
  }

  const onBuyDone = () => {
    getLastSaleOrder()
    getListOrders()
  }

  const onBidApprove = async (bidData: IBidData) => {
    if (!chainId || !chainName) {
      throw new Error('Please connect to your wallet')
    }

    const currency = getAddressByName(bidData.currencyName as ContractName, chainId)
    const price = ethers.utils.parseEther(bidData.price.toString())

    if (!await checkValid(currency, price.toString(), chainId)) {
      return
    }

    const omni = getCurrencyInstance(currency, chainId, signer)

    const approveTxs = []
    approveTxs.push(await approve(omni, address, getAddressByName('FundManager', chainId), price))
    if (isUsdcOrUsdt(currency)) {
      approveTxs.push(await approve(omni, address, getAddressByName('StargatePoolManager', chainId), price))
    }

    return approveTxs.filter(Boolean)
  }

  const onBidConfirm = async (bidData: IBidData) => {
    if (!chainId || !chainName) {
      throw new Error('Please connect to your wallet')
    }

    const lzChainId = getLayerzeroChainId(chainId)

    const currency = getAddressByName(bidData.currencyName as ContractName, chainId)
    const price = ethers.utils.parseEther(bidData.price.toString())
    const protocalFees = ethers.utils.parseUnits(PROTOCAL_FEE.toString(), 2)
    const creatorFees = ethers.utils.parseUnits(CREATOR_FEE.toString(), 2)

    await checkValid(currency, price.toString(), chainId)

    await postMakerOrder(
      signer as any,
      false,
      collection_address,
      getAddressByName('Strategy', chainId),
      1,
      price,
      protocalFees,
      creatorFees,
      currency,
      {
        tokenId: token_id,
        params: {
          values: [lzChainId],
          types: ['uint16'],
        },
      },
      getChainNameFromId(chainId),
      chainId,
      true,
      collection_name
    )
  }

  const onBidDone = () => {
    getBidOrders()
  }

  const onAccept = async (bidOrder: IOrder) => {
    if (owner_collection_chain_id != chainId) {
      dispatch(openSnackBar({ message: `Please switch network to ${owner_collection_chain}`, status: 'warning' }))
      return
    }
    if (!chainId || !chainName) return
    const isONFTCore = await validateONFT(bidOrder.collectionAddress, selectedNFTItem.contract_type || 'ERC721', bidOrder.chain_id)
    const orderChainId = bidOrder.chain_id
    const blockNumber = await provider.getBlockNumber()
    const targetProvier = getProvider(orderChainId)
    const targetBlockNumber = await targetProvier.getBlockNumber()

    const lzChainId = getLayerzeroChainId(chainId)
    const omnixExchange = getOmnixExchangeInstance(chainId, signer)
    const makerBid : MakerOrderWithSignature = {
      isOrderAsk: false,
      signer: bidOrder.signer,
      collection: bidOrder.collectionAddress,
      price: bidOrder.price,
      tokenId: bidOrder.tokenId,
      amount: bidOrder.amount,
      strategy: bidOrder.strategy,
      currency: bidOrder.currencyAddress,
      nonce: bidOrder.nonce,
      startTime: bidOrder.startTime,
      endTime: bidOrder.endTime,
      minPercentageToAsk: bidOrder.minPercentageToAsk,
      params: ethers.utils.defaultAbiCoder.encode(['uint16'], bidOrder.params),
      signature: bidOrder.signature
    }

    const currencyName = getCurrencyNameAddress(bidOrder.currencyAddress) as ContractName
    const newCurrencyName = validateCurrencyName(currencyName, chainId)
    const currencyAddress = getAddressByName(newCurrencyName, chainId)

    const takerAsk : TakerOrderWithEncodedParams = {
      isOrderAsk: true,
      taker: address || '0x',
      price: bidOrder.price || '0',
      tokenId: bidOrder.tokenId || '0',
      minPercentageToAsk: bidOrder.minPercentageToAsk || '0',
      params: ethers.utils.defaultAbiCoder.encode(['uint16',
        'address',
        'address',
        'address',
        'uint256'
      ], [
        lzChainId,
        currencyAddress,
        collection_address,
        getAddressByName('Strategy', chainId),
        getConversionRate(currencyName, newCurrencyName)
      ])
    }

    const transferSelector = getTransferSelectorNftInstance(chainId, signer)
    const transferManagerAddr = await transferSelector.checkTransferManagerForToken(collection_address)
    const nftContract = getERC721Instance(collection_address, chainId, signer)
    const txApprove = await approveNft(nftContract, address, transferManagerAddr, token_id)
    if (txApprove) {
      await txApprove.wait()
    }

    const [omnixFee, currencyFee, nftFee] = await omnixExchange.connect(signer as any).getLzFeesForTrading(takerAsk, makerBid)
    const lzFee = omnixFee.add(currencyFee).add(nftFee)
    
    console.log('---lzFee---', 
      ethers.utils.formatEther(omnixFee),
      ethers.utils.formatEther(currencyFee),
      ethers.utils.formatEther(nftFee),
      ethers.utils.formatEther(lzFee)
    )

    const tx = await omnixExchange.connect(signer as any).matchBidWithTakerAsk(takerAsk, makerBid, { value: lzFee })

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
      senderChainId: chainId,
      senderAddress: currencyAddress,
      senderBlockNumber: blockNumber,
      targetChainId: orderChainId,
      targetAddress: bidOrder.currencyAddress,
      targetBlockNumber: targetBlockNumber,
      isONFTCore,
      contractType: selectedNFTItem.contract_type || 'ERC721',
      nftItem: selectedNFTItem,
      itemName: selectedNFTItem.name,
      lastTxAvailable: false
    }

    const historyIndex = addTxToHistories(pendingTx)
    await listenONFTEvents(pendingTx, historyIndex)
    await tx.wait()

    const receipt = await tx.wait()
    if(receipt != null){
      // const currencyName = getCurrencyNameAddress(bidOrder.currencyAddress) as ContractName

      await updateOrderStatus(bidOrder, 'EXECUTED')
      await collectionsService.updateCollectionNFTChainID(collection_name, token_id, Number(chainId))

      dispatch(openSnackBar({ message: 'Accepted a Bid', status: 'success' }))
      getLastSaleOrder()
      getListOrders()
      getBidOrders()
    }
  }

  return {
    openBidDlg,
    openSellDlg,
    openBuyDlg,
    setOpenSellDlg,
    setOpenBidDlg,
    setOpenBuyDlg,
    getListOrders,
    getBidOrders,
    getLastSaleOrder,
    updateOrderStatus,
    onListingApprove,
    onListingConfirm,
    onListingDone,
    onBuyApprove,
    onBuyConfirm,
    onBuyComplete,
    onBuyDone,
    onBidApprove,
    onBidConfirm,
    onBidDone,
    onAccept
  }
}

export default useTrading
