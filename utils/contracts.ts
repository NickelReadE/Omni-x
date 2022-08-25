import {ethers} from 'ethers'
import {ContractName, getAddressByName, getProvider, rpcProviders} from './constants'
import OmnixBridgeABI from '../constants/abis/OmnixBridge.json'
import OmnixBridge1155ABI from '../constants/abis/OmnixBridge1155.json'
import OmnixExchangeABI from '../constants/abis/OmnixExchange.json'
import TransferSelectorNFTABI from '../constants/abis/TransferSelectorNFT.json'
import OmniABI from '../constants/abis/Omni.json'
import ERC721ABI from '../constants/abis/ERC721.json'
import ERC1155ABI from '../constants/abis/ERC1155.json'
import ERC20Abi from '../constants/abis/ERC20.json'
import ONFTCore721 from '../constants/abis/ONFTCore721.json'
import ONFTCore1155 from '../constants/abis/ONFTCore1155.json'
import LZEndpointABI from '../constants/abis/LayerzeroEndpoint.json'

export const getContractInstanceByAddr = (address: string, abi: any, chainId: number, signer: any) => {
  if (signer === null) {
    const provider = getProvider(chainId)
    return new ethers.Contract(
      address,
      abi,
      provider
    )
  }
  return new ethers.Contract(
    address,
    abi,
    signer
  )
}

export const getContractInstance = (name: ContractName, abi: any, chainId: number, signer: any) => {
  const address = getAddressByName(name, chainId)
  return getContractInstanceByAddr(address, abi, chainId, signer)
}

export const getOmnixBridgeInstance = (chainId: number, signer: any) => {
  return getContractInstance('Omnix', OmnixBridgeABI, chainId, signer)
}

export const getOmnixBridge1155Instance = (chainId: number, signer: any) => {
  return getContractInstance('Omnix1155', OmnixBridge1155ABI, chainId, signer)
}

export const getERC721Instance = (contractAddress: string, chainId: number, signer: any) => {
  return getContractInstanceByAddr(contractAddress, ERC721ABI, chainId, signer)
}

export const getERC1155Instance = (contractAddress: string, chainId: number, signer: any) => {
  return getContractInstanceByAddr(contractAddress, ERC1155ABI, chainId, signer)
}

export const getONFTCore721Instance = (contractAddress: string, chainId: number, signer: any) => {
  return getContractInstanceByAddr(contractAddress, ONFTCore721, chainId, signer)
}

export const getONFTCore1155Instance = (contractAddress: string, chainId: number, signer: any) => {
  return getContractInstanceByAddr(contractAddress, ONFTCore1155, chainId, signer)
}

export const getOmnixExchangeInstance = (chainId: number, signer: any) => {
  return getContractInstance('OmnixExchange', OmnixExchangeABI, chainId, signer);
}

export const getOmniInstance = (chainId: number, signer: any) => {
  return getContractInstance('OMNI', OmniABI, chainId, signer);
}

export const getTransferSelectorNftInstance = (chainId: number, signer: any) => {
  return getContractInstance('TransferSelectorNFT', TransferSelectorNFTABI, chainId, signer);
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

export const getCurrencyInstance = (address: string, chainId: number, signer: any) => {
  return getContractInstanceByAddr(address, ERC20Abi, chainId, signer);
}