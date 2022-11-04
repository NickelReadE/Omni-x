import {providers} from 'ethers'
import {MakerOrder, SolidityType, SupportedChainId} from '../types'
import {etherSignTypedData} from './etherSignTypedData'
import {generateMakerOrderTypedData} from './generateMakerOrderTypedData'

/**
 * Create a signature for a maker order
 * @param signer user signer
 * @param chainId current chain id
 * @param verifyingContractAddress Looksrare exchange contract address
 * @param order see MakerOrder
 * @param paramsTypes
 * @returns String signature
 */
export const signMakerOrder = async (
  signer: providers.JsonRpcSigner,
  chainId: SupportedChainId,
  verifyingContractAddress: string,
  order: MakerOrder,
  paramsTypes: SolidityType[]
): Promise<string> => {
  const signerAddress = await signer.getAddress()
  const { domain, type, value } = generateMakerOrderTypedData(signerAddress, chainId, order, verifyingContractAddress)
  return await etherSignTypedData(signer.provider, signerAddress, domain, type, value)
}
