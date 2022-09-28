import { addDays } from "date-fns"
import { BigNumber, BigNumberish, ethers, Signer } from "ethers"
import { Dispatch, SetStateAction, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { IBidData, IGetOrderRequest, IListingData, IOrder, OrderStatus } from "../interface/interface"
import { getLastSaleOrders, getOrders } from "../redux/reducers/ordersReducer"
import { openSnackBar } from "../redux/reducers/snackBarReducer"
import { collectionsService } from '../services/collections'

import { userService } from "../services/users"
import { MakerOrderWithSignature, TakerOrderWithEncodedParams } from "../types"
import { SaleType } from "../types/enum"
import { ContractName, CREATOR_FEE, getAddressByName, getChainNameById, getCurrencyNameAddress, getLayerzeroChainId, isUsdcOrUsdt, PROTOCAL_FEE } from "../utils/constants"
import { getCurrencyInstance, getCurrencyManagerInstance, getERC721Instance, getOmnixExchangeInstance, getTransferSelectorNftInstance } from "../utils/contracts"
import { acceptOrder, postMakerOrder } from "../utils/makeOrder"
import { useEffect } from 'react'
import { getChainNameFromId } from '../utils/constants'
import { useMemo } from "react"
import { ChainIds } from "../types/enum"

export type TradingFunction = {
  openSellDlg: boolean,
  openBidDlg: boolean,
  setOpenSellDlg: Dispatch<SetStateAction<boolean>>,
  setOpenBidDlg: Dispatch<SetStateAction<boolean>>,
  getListOrders: () => void,
  getBidOrders: () => void,
  getLastSaleOrder: () => void,
  updateOrderStatus: (order: IOrder, status: OrderStatus) => Promise<void>,
  onListing: (listingData: IListingData) => Promise<void>,
  onBuy: (order?: IOrder) => Promise<void>,
  onBid: (bidData: IBidData, order?: IOrder) => Promise<void>,
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

  return (await contract.approve(operator, tokenId)).wait()
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
  token_id
}: any): TradingFunction => {
  const [openSellDlg, setOpenSellDlg] = useState(false)
  const [openBidDlg, setOpenBidDlg] = useState(false)

  const dispatch = useDispatch()

  const chain_id = provider?._network?.chainId
  const chain_name = chain_id && getChainNameFromId(chain_id)

  const checkValid = async (currency: string, price: string, chainId: number) => {
    if (currency===''){
      dispatch(openSnackBar({ message: 'Current Currency is not supported in this network', status: 'error' }))
      setOpenBidDlg(false)
      return
    }

    const currencyMangerContract = getCurrencyManagerInstance(chainId, signer)
    if (currencyMangerContract===null){
      dispatch(openSnackBar({ message: "This network doesn't support currencies", status: 'error' }))
      setOpenBidDlg(false)
      return false
    }

    if (!await currencyMangerContract.isCurrencyWhitelisted(currency)) {
      dispatch(openSnackBar({ message: 'USDC currency is not whitelisted in this network', status: 'error' }))
      setOpenBidDlg(false)
      return false
    }

    if (Number(price) === 0) {
      dispatch(openSnackBar({ message: 'Please enter a number greater than 0', status: 'error' }))
      setOpenBidDlg(false)
      return false
    }

    const currencyContract = getCurrencyInstance(currency, chainId, signer)
    const balance = await currencyContract?.balanceOf(address)
    if (balance.lt(BigNumber.from(price))) {
      dispatch(openSnackBar({ message: 'There is not enough balance', status: 'error' }))
      setOpenBidDlg(false)
      return false
    }

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

  const chainId = useMemo(() => { if (provider && provider?.network) { return provider?.network.chainId } return ChainIds.ETHEREUM }, [provider])

  const onListing = async (listingData: IListingData) => {
    if (owner_collection_chain != chain_name) {
      dispatch(openSnackBar({ message: `Please switch network to ${owner_collection_chain}`, status: 'warning' }))
      return
    }

    const price = ethers.utils.parseEther(listingData.price.toString())
    const amount = ethers.utils.parseUnits('1', 0)
    const protocalFees = ethers.utils.parseUnits(PROTOCAL_FEE.toString(), 2)
    const creatorFees = ethers.utils.parseUnits(CREATOR_FEE.toString(), 2)
    const lzChainId = getLayerzeroChainId(chainId)
    const startTime = Date.now()

    await postMakerOrder(
      provider as any,
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
          values: [lzChainId, listingData.isAuction ? SaleType.AUCTION : SaleType.FIXED],
          types: ['uint16', 'uint16'],
        },
      },
      chain_name,
      true
    )
    await collectionsService.updateCollectionNFTListPrice(collection_name,token_id,listingData.price)

    if (!listingData.isAuction) {
      const transferSelector = getTransferSelectorNftInstance(chainId, signer)
      const transferManagerAddr = await transferSelector.checkTransferManagerForToken(collection_address)
      const nftContract = getERC721Instance(collection_address, chainId, signer)
      await approveNft(nftContract, address, transferManagerAddr, token_id)
    }

    dispatch(openSnackBar({ message: '  Success', status: 'success' }))
    getListOrders()
    setOpenSellDlg(false)
  }

  
  const onBuy = async (order?: IOrder) => {
    if (!order) {
      dispatch(openSnackBar({ message: 'Not listed', status: 'warning' }))
      return
    }

    const lzChainId = getLayerzeroChainId(chainId)
    const omniAddress = getAddressByName(getCurrencyNameAddress(order.currencyAddress) as ContractName, chainId)
    
    if (!(await checkValid(omniAddress, order?.price, chainId))) {
      return
    }
    const omni = getCurrencyInstance(omniAddress, chainId, signer)
    if (!omni) {
      dispatch(openSnackBar({ message: 'Could not find the currency', status: 'warning' }))
      return
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
      params: ethers.utils.defaultAbiCoder.encode(['uint16','uint16'], order?.params),
      signature: order?.signature
    }
    const takerBid : TakerOrderWithEncodedParams = {
      isOrderAsk: false,
      taker: address || '0x',
      price: order?.price || '0',
      tokenId: order?.tokenId || '0',
      minPercentageToAsk: order?.minPercentageToAsk || '0',
      params: ethers.utils.defaultAbiCoder.encode(['uint16'], [lzChainId])
    }

    const approveTxs = []

    approveTxs.push(await approve(omni, address, omnixExchange.address, takerBid.price))
    approveTxs.push(await approve(omni, address, getAddressByName('FundManager', chainId), takerBid.price))

    if (isUsdcOrUsdt(order?.currencyAddress)) {
      approveTxs.push(await approve(omni, address, getAddressByName('StargatePoolManager', chainId), takerBid.price))
    }

    await Promise.all(approveTxs.filter(Boolean).map(tx => tx.wait()))

    const lzFee = await omnixExchange.connect(signer as any).getLzFeesForAskWithTakerBid(takerBid, makerAsk)

    await omnixExchange.connect(signer as any).matchAskWithTakerBid(takerBid, makerAsk, { value: lzFee })

    await updateOrderStatus(order, 'EXECUTED')

    await collectionsService.updateCollectionNFTListPrice(collection_name,token_id,0)
    await collectionsService.updateCollectionNFTSalePrice(collection_name,token_id,Number(order?.price))


    dispatch(openSnackBar({ message: 'Bought an NFT', status: 'success' }))
    getLastSaleOrder()
    getListOrders()
  }

  const onBid = async (bidData: IBidData, order?: IOrder) => {
    if (!order) {
      dispatch(openSnackBar({ message: '  Please list first to place a bid', status: 'warning' }))
      return
    }

    const chainId = useMemo(() => { if (provider && provider?.network) { return provider?.network.chainId } return ChainIds.ETHEREUM }, [provider])
    const lzChainId = getLayerzeroChainId(chainId)

    const currency = getAddressByName(bidData.currencyName as ContractName, chainId)
    const price = ethers.utils.parseEther(bidData.price.toString())
    const protocalFees = ethers.utils.parseUnits(PROTOCAL_FEE.toString(), 2)
    const creatorFees = ethers.utils.parseUnits(CREATOR_FEE.toString(), 2)

    if (!checkValid(currency, price.toString(), chainId)) {
      return
    }

    try {
      
      const omni = getCurrencyInstance(currency, chainId, signer)

      if (!omni) {
        dispatch(openSnackBar({ message: 'Could not find the currency', status: 'warning' }))
        return
      }
      await postMakerOrder(
        provider as any,
        false,
        order?.collectionAddress,
        order?.strategy,
        order?.amount,
        price,
        protocalFees,
        creatorFees,
        currency,
        {
          tokenId: token_id,
          startTime: order.startTime,
          endTime: order.endTime,
          params: {
            values: [lzChainId],
            types: ['uint16'],
          },
        },
        getChainNameById(chainId),
        true
      )

      const approveTxs = []
      approveTxs.push(await approve(omni, address, getAddressByName('OmnixExchange', chainId), price))
      approveTxs.push(await approve(omni, address, getAddressByName('FundManager', chainId), price))
      if (isUsdcOrUsdt(currency)) {
        approveTxs.push(await approve(omni, address, getAddressByName('StargatePoolManager', chainId), price))
      }
      await Promise.all(approveTxs.filter(Boolean).map(tx => tx.wait()))

      setOpenBidDlg(false)
      getBidOrders()
      dispatch(openSnackBar({ message: 'Place a bid Success', status: 'success' }))
    } catch (err: any) {
      console.error(err)
      dispatch(openSnackBar({ message: err.message, status: 'error' }))
    }
  }

  const onAccept = async (bidOrder: IOrder) => {
    if (owner_collection_chain != chain_name) {
      dispatch(openSnackBar({ message: `Please switch network to ${owner_collection_chain}`, status: 'warning' }))
      return
    }

    const chainId = provider?.network.chainId || 5
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
    const takerAsk : TakerOrderWithEncodedParams = {
      isOrderAsk: true,
      taker: address || '0x',
      price: bidOrder.price || '0',
      tokenId: bidOrder.tokenId || '0',
      minPercentageToAsk: bidOrder.minPercentageToAsk || '0',
      params: ethers.utils.defaultAbiCoder.encode(['uint16'], [lzChainId])
    }

    const transferSelector = getTransferSelectorNftInstance(chainId, signer)
    const transferManagerAddr = await transferSelector.checkTransferManagerForToken(collection_address)
    const nftContract = getERC721Instance(collection_address, chainId, signer)
    await approveNft(nftContract, address, transferManagerAddr, token_id)

    const lzFee = await omnixExchange.connect(signer as any).getLzFeesForBidWithTakerAsk(takerAsk, makerBid)
    
    await omnixExchange.connect(signer as any).matchBidWithTakerAsk(takerAsk, makerBid, { value: lzFee })

    await updateOrderStatus(bidOrder, 'EXECUTED')
    await collectionsService.updateCollectionNFTListPrice(collection_name,token_id,0)
    await collectionsService.updateCollectionNFTSalePrice(collection_name,token_id,Number(bidOrder?.price))

    dispatch(openSnackBar({ message: 'Accepted a Bid', status: 'success' }))
    getLastSaleOrder()
    getListOrders()
    getBidOrders()
  }

  return {
    openBidDlg,
    openSellDlg,
    setOpenSellDlg,
    setOpenBidDlg,
    getListOrders,
    getBidOrders,
    getLastSaleOrder,
    updateOrderStatus,
    onListing,
    onBuy,
    onBid,
    onAccept
  }
}

export default useTrading
