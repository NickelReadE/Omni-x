import {ethers} from 'ethers'
import {getAddressByName, getProvider, rpcProviders} from './constants'
import OmnixBridgeABI from '../constants/abis/OmnixBridge.json'
import OmnixBridge1155ABI from '../constants/abis/OmnixBridge1155.json'
import ERC721ABI from '../constants/abis/ERC721.json'
import ERC1155ABI from '../constants/abis/ERC1155.json'
import ONFTCore721 from '../constants/abis/ONFTCore721.json'
import ONFTCore1155 from '../constants/abis/ONFTCore1155.json'
import LZEndpointABI from '../constants/abis/LayerzeroEndpoint.json'
import veSTG from '../constants/abis/veSTG.json'
import RoyaltyFeeManagerABI from '../constants/abis/RoyaltyFeeManager.json'
export const getOmnixBridgeInstance = (chainId: number, signer: any) => {
  const address = getAddressByName('Omnix', chainId)
  if (signer === null) {
    const provider = getProvider(chainId)
    return new ethers.Contract(
      address,
      OmnixBridgeABI,
      provider
    )
  }
  return new ethers.Contract(
    address,
    OmnixBridgeABI,
    signer
  )
}

export const getOmnixBridge1155Instance = (chainId: number, signer: any) => {
  const address = getAddressByName('Omnix1155', chainId)
  if (signer === null) {
    const provider = getProvider(chainId)
    return new ethers.Contract(
      address,
      OmnixBridge1155ABI,
      provider
    )
  }
  return new ethers.Contract(
    address,
    OmnixBridge1155ABI,
    signer
  )
}

export const getERC721Instance = (contractAddress: string, chainId: number, signer: any) => {
  if (signer === null) {
    const provider = getProvider(chainId)
    return new ethers.Contract(
      contractAddress,
      ERC721ABI,
      provider
    )
  }
  return new ethers.Contract(
    contractAddress,
    ERC721ABI,
    signer
  )
}

export const getONFTCore721Instance = (contractAddress: string, chainId: number, signer: any) => {
  if (signer === null) {
    const provider = getProvider(chainId)
    return new ethers.Contract(
      contractAddress,
      ONFTCore721,
      provider
    )
  }
  return new ethers.Contract(
    contractAddress,
    ONFTCore721,
    signer
  )
}

export const getONFTCore1155Instance = (contractAddress: string, chainId: number, signer: any) => {
  if (signer === null) {
    const provider = getProvider(chainId)
    return new ethers.Contract(
      contractAddress,
      ONFTCore1155,
      provider
    )
  }
  return new ethers.Contract(
    contractAddress,
    ONFTCore1155,
    signer
  )
}

export const getERC1155Instance = (contractAddress: string, chainId: number, signer: any) => {
  if (signer === null) {
    const provider = getProvider(chainId)
    return new ethers.Contract(
      contractAddress,
      ERC1155ABI,
      provider
    )
  }
  return new ethers.Contract(
    contractAddress,
    ERC1155ABI,
    signer
  )
}

export const getVeSTGInstance = (contractAddress: string, chainId: number, signer: any) => {
  if (signer === null) {
    const provider = getProvider(chainId)
    return new ethers.Contract(
      contractAddress,
      veSTG,
      provider
    )
  }
  return new ethers.Contract(
    contractAddress,
    veSTG,
    signer
  )
}

export const getRoyaltyFeeMangerInstance = (contractAddress: string,chainId: number) => {
  const provider = getProvider(chainId)
  return new ethers.Contract(
    contractAddress,
    RoyaltyFeeManagerABI,
    provider
  )
}

export const getLayerZeroEndpointInstance = (chainId: number, provider: any) => {
  const address = getAddressByName('LayerZeroEndpoint', chainId)
  return new ethers.Contract(
    address,
    LZEndpointABI,
    provider
  )
}

export const validateContract = async (chainId: number, address: string): Promise<boolean> => {
  const provider = getProvider(chainId)
  const bytecode = await provider.getCode(address)

  // No code : "0x" then functionA is definitely not there
  return bytecode.length > 2
}
