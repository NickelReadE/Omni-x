import { providers, BigNumber, ethers } from 'ethers'
import addTime from 'date-fns/add'
import { userService } from '../services/users'
import { orderService } from '../services/orders'
import { addressesByNetwork, minNetPriceRatio } from '../constants'
import { SupportedChainId, SolidityType, MakerOrder } from '../types'
import { signMakerOrder } from '../sign/signMakerOrder'
// import { MakerOrder, signMakerOrder, SupportedChainId, SolidityType } from "@looksrare/sdk"
import { useDispatch } from 'react-redux'
import { TypedDataUtils } from 'ethers-eip712'
import { generateMakerOrderTypedData } from '../sign/generateMakerOrderTypedData'

interface PostMakerOrderOptionalParams {
    tokenId?: string
    startTime?: number
    endTime?: number
    params?: { values: any[]; types: SolidityType[] }
}

const prepareMakerOrder = async(
    signer: ethers.providers.JsonRpcSigner,
    signerAddress: string,
    chainId: number,
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
    chain: string
) => {
  const now = Date.now()
  const { tokenId, params, startTime, endTime } = optionalParams
  const paramsValue = params ? params.values : []
  const paramsTypes = params ? params.types : []
  const netPriceRatio = BigNumber.from(10000).sub(protocolFees.add(creatorFees)).toNumber()
  const addresses = addressesByNetwork[SupportedChainId.RINKEBY]

  const makerOrder: MakerOrder = {
    isOrderAsk,
    signer: signerAddress,
    collection: collectionAddress,
    price: price.toString(),
    tokenId: tokenId?.toString() || "0",
    amount: amount.toString(),
    strategy: strategyAddress,
    currency,
    nonce,
    startTime: startTime ? Math.floor(startTime / 1000) : Math.floor(now / 1000),
    endTime: endTime ? Math.floor(endTime / 1000) : Math.floor(addTime(now, { months: 1 }).getTime() / 1000),
    minPercentageToAsk: Math.min(netPriceRatio, minNetPriceRatio),
    params: paramsValue,
  }
  const signatureHash = await signMakerOrder(signer, chainId, addresses.EXCHANGE, makerOrder, paramsTypes)
  const data = {
    ...makerOrder,
    signature: signatureHash,
    chain
  }

  return data
}

const zeroPad = (value: any, length: number) => {
  return ethers.utils.arrayify(ethers.utils.hexZeroPad(ethers.utils.hexlify(value), length))
}

/*const signMakerOrder = async(
  signer: providers.JsonRpcSigner,
  chainId: SupportedChainId,
  verifyingContractAddress: string,
  order: MakerOrder,
  paramsTypes: SolidityType[]) => {

  const signerAddress = await signer.getAddress();
  const { domain, type, value } = generateMakerOrderTypedData(signerAddress, chainId, order, verifyingContractAddress);
}*/

export const postMakerOrder = async(
  library: providers.Web3Provider,
  chainId: number,
  isOrderAsk: boolean,
  collectionAddress: string,
  strategyAddress: string,
  amount: BigNumber,
  price: BigNumber,
  protocolFees: BigNumber,
  creatorFees: BigNumber,
  currency: string,
  optionalParams: PostMakerOrderOptionalParams = {},
  chain: string
) => {
    
  const signer = library.getSigner()
  const signerAddress = await signer.getAddress()
  let nonce = await userService.getUserNonce(signerAddress)

  const data = await prepareMakerOrder(
    signer,
    signerAddress,
    chainId,
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
    chain
  )

  const order = await orderService.createOrder(data)

  return order
}

/**
 * Update a maker order
 * @param library Etherjs provider
 * @see prepareMakerOrder for other params
 */
 export const updateMakerOrder = async (
  library: providers.Web3Provider,
  chainId: number,
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
  chain: string
) => {
  const signer = library.getSigner()
  const signerAddress = await signer.getAddress()

  const data = await prepareMakerOrder(
    signer,
    signerAddress,
    chainId,
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
    chain
  )

  const order = await orderService.createOrder(data)

  return data
};