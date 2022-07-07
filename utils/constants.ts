import OmnixBridge from '../constants/OmnixBridge.json'
import OmnixBridge1155 from '../constants/OmnixBridge1155.json'
import LZEndpoint from '../constants/LayerzeroEndpoints.json'
import ChainIds from '../constants/chainIds.json'

const omnixBridge: any = OmnixBridge
const omnixBridge1155: any = OmnixBridge1155
const lzEndpoint: any = LZEndpoint
const chainIds: any = ChainIds

const environments: any = {
  mainnet: ['ethereum', 'bsc', 'avalanche', 'polygon', 'arbitrum', 'optimism', 'fantom'],
  testnet: ['rinkeby', 'bsc-testnet', 'fuji', 'mumbai', 'arbitrum-rinkeby', 'optimism-kovan', 'fantom-testnet']
}

const environment = process.env.NEXT_PUBLICE_ENVIRONMENT || 'testnet'

export const rpcProviders: { [key: number]: string } = {
  4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  43113: 'https://api.avax-test.network/ext/bc/C/rpc',
  80001: 'https://speedy-nodes-nyc.moralis.io/99e98b2333a911011f42606d/polygon/mumbai',
  421611: 'https://rinkeby.arbitrum.io/rpc',
  69: 'https://kovan.optimism.io',
  4002: 'https://rpc.testnet.fantom.network'
}

export const chains: { [key: number]: string } = {
  4: 'rinkeby',
  97: 'bsc-testnet',
  43113: 'fuji',
  80001: 'mumbai',
  421611: 'arbitrum-rinkeby',
  69: 'optimism-kovan',
  4002: 'fantom-testnet'
}

export const getLayerzeroChainId = (chainId: number): number => {
  return chainIds[chains[chainId]]
}

export const getAddressByName = (name: string, chainId: number) => {
  if (name === 'Omnix') {
    return omnixBridge[chains[chainId]]
  } else if (name === 'Omnix1155') {
    return omnixBridge1155[chains[chainId]]
  } else if (name === 'LayerZeroEndpoint') {
    return lzEndpoint[chains[chainId]]
  }
}
