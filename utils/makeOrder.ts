import {BigNumber, BigNumberish, ethers, providers} from 'ethers'
import addTime from 'date-fns/add'
import {TypedDataUtils} from 'ethers-eip712'
import {userService} from '../services/users'
import {orderService} from '../services/orders'
import {minNetPriceRatio} from '../constants'
import {MakerOrder, MakerOrderWithEncodedParams, SolidityType} from '../types'
import {OrderStatus} from '../interface/interface'

const MAKE_ORDER_SIGN_TYPES = {
  EIP712Domain: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' }
  ],
  MakerOrder: [
    { name: 'isOrderAsk', type: 'bool' },
    { name: 'signer', type: 'address' },
    { name: 'collection', type: 'address' },
    { name: 'price', type: 'uint256' },
    { name: 'tokenId', type: 'uint256' },
    { name: 'amount', type: 'uint256' },
    { name: 'strategy', type: 'address' },
    { name: 'currency', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'startTime', type: 'uint256' },
    { name: 'endTime', type: 'uint256' },
    { name: 'minPercentageToAsk', type: 'uint256' },
    { name: 'params', type: 'bytes' }
  ]
}
interface PostMakerOrderOptionalParams {
    tokenId?: string
    startTime?: number
    endTime?: number
    params?: { values: any[]; types: SolidityType[] }
}

const prepareMakerOrder = async(
  signer: ethers.providers.JsonRpcSigner | ethers.Signer | undefined,
  signerAddress: string,
  isOrderAsk: boolean,
  collectionAddress: string,
  strategyAddress: string,
  amount: BigNumber,
  price: BigNumber,
  nonce: BigNumber,
  protocolFees: BigNumber,
  creatorFees: BigNumber,
  currency: string,
  optionalParams: PostMakerOrderOptionalParams = {},
  chain: string,
  chain_id: number,
  col_url: string,
) => {
  const now = Date.now()
  const { tokenId, params, startTime, endTime } = optionalParams
  const paramsValue = params ? params.values : []
  const paramsTypes = params ? params.types : []
  const netPriceRatio = BigNumber.from(10000).sub(protocolFees.add(creatorFees)).toNumber()

  const makerOrder: MakerOrder = {
    isOrderAsk,
    signer: signerAddress,
    collection: collectionAddress,
    price: price.toString(),
    tokenId: tokenId?.toString() || '0',
    amount: amount.toString(),
    strategy: strategyAddress,
    currency,
    nonce,
    startTime: startTime ? Math.floor(startTime / 1000) : Math.floor(now / 1000),
    endTime: endTime ? Math.floor(endTime / 1000) : Math.floor(addTime(now, { months: 1 }).getTime() / 1000),
    minPercentageToAsk: Math.min(netPriceRatio, minNetPriceRatio),
    params: paramsValue,
  }

  let signatureHash = '0x0'
  if (signer) {
    signatureHash = await signMakerOrder(signer, makerOrder, paramsTypes)
  }

  return {
    ...makerOrder,
    signature: signatureHash,
    col_url: col_url,
    chain,
    chain_id,
  }
}

export const postMakerOrder = async(
  signer: ethers.Signer,
  isOrderAsk: boolean,
  collectionAddress: string,
  strategyAddress: string,
  amount: BigNumberish,
  price: BigNumberish,
  protocolFees: BigNumberish,
  creatorFees: BigNumberish,
  currency: string,
  optionalParams: PostMakerOrderOptionalParams = {},
  chain: string,
  chain_id: number,
  needSign: boolean,
  col_url: string,
) => {

  const signerAddress = await signer.getAddress()
  const nonce = await userService.getUserNonce(signerAddress)

  const data = await prepareMakerOrder(
    needSign ? signer : undefined,
    signerAddress,
    isOrderAsk,
    collectionAddress,
    strategyAddress,
    BigNumber.from(amount),
    BigNumber.from(price),
    nonce,
    BigNumber.from(protocolFees),
    BigNumber.from(creatorFees),
    currency,
    optionalParams,
    chain,
    chain_id,
    col_url,
  )

  return await orderService.createOrder(data)
}

/**
 * Update a maker order
 * @param library Etherjs provider
 * @param isOrderAsk
 * @param collectionAddress
 * @param strategyAddress
 * @param amount
 * @param price
 * @param nonce
 * @param protocolFees
 * @param creatorFees
 * @param currency
 * @param optionalParams
 * @param chain
 * @param chain_id
 * @param col_url
 * @see prepareMakerOrder for other params
 */
export const updateMakerOrder = async (
  library: providers.Web3Provider,
  isOrderAsk: boolean,
  collectionAddress: string,
  strategyAddress: string,
  amount: BigNumber,
  price: BigNumber,
  nonce: BigNumber,
  protocolFees: BigNumber,
  creatorFees: BigNumber,
  currency: string,
  optionalParams: PostMakerOrderOptionalParams = {},
  chain: string,
  chain_id: number,
  col_url: string,
) => {
  const signer = library.getSigner()
  const signerAddress = await signer.getAddress()

  const data = await prepareMakerOrder(
    signer,
    signerAddress,
    isOrderAsk,
    collectionAddress,
    strategyAddress,
    amount,
    price,
    nonce,
    protocolFees,
    creatorFees,
    currency,
    optionalParams,
    chain,
    chain_id,
    col_url,
  )

  await orderService.createOrder(data)

  return data
}

export const acceptOrder = async (
  hash: string, tokeId: number,status: OrderStatus
) => {
  const data  = {
    hash: hash,
    tokenId:tokeId,
    status
  }
  try{
    await orderService.acceptOrder(data)
  } catch(error) {
    console.log(error)
  }
}

const zeroPad = (value: any, length: number) => {
  return ethers.utils.arrayify(ethers.utils.hexZeroPad(ethers.utils.hexlify(value), length))
}

export const encodeMakerOrder = (order: MakerOrder, paramsTypes: SolidityType[]) : MakerOrderWithEncodedParams => {
  return {
    ...order,
    params: ethers.utils.defaultAbiCoder.encode(paramsTypes, order.params)
  }
}

/**
 * Create a signature for a maker order
 * @param signer user signer
 * @param order see MakerOrder
 * @param paramsTypes contains an array of solidity types mapping the params array types
 * @returns String signature
 */
const signMakerOrder = async (signer: providers.JsonRpcSigner | ethers.Signer, order: MakerOrder, paramsTypes: SolidityType[]): Promise<string> => {
  const encodedOrder = encodeMakerOrder(order, paramsTypes)
  const typedData = {
    domain: {},
    types: MAKE_ORDER_SIGN_TYPES,
    primaryType: 'MakerOrder',
    message: encodedOrder
  }

  const eip191Header = ethers.utils.arrayify('0x1901')
  const messageHash = TypedDataUtils.hashStruct(typedData, typedData.primaryType, typedData.message)
  const pack = ethers.utils.solidityPack(['bytes', 'bytes32'], [
    eip191Header,
    zeroPad(messageHash, 32)
  ])
  const digest = ethers.utils.keccak256(pack)
  return await signer.signMessage(ethers.utils.arrayify(digest))
}
