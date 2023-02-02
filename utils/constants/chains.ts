import {BigNumber, ethers} from 'ethers'
import ChainIds from '../../constants/layerzero/chainIds.json'
import CHAINS from '../../constants/chains.json'
import {CHAIN_TYPE} from '../../types/enum'
import {Network} from 'alchemy-sdk'
import {Chain} from 'wagmi'

const chainIds: any = ChainIds

export const PROTOCAL_FEE = 2
export const CREATOR_FEE = 2

export const PERIOD_LIST = [
  { value: 0, text: '1 Day', period: 1, },
  { value: 1, text: '1 Week', period: 7, },
  { value: 2, text: '1 Month', period: 30, },
  { value: 3, text: '1 Year', period: 365, },
]

export const CHAIN_IDS = {
  [CHAIN_TYPE.GOERLI]: 5,
  [CHAIN_TYPE.BSC_TESTNET]: 97,
  [CHAIN_TYPE.MUMBAI]: 80001,
  [CHAIN_TYPE.FUJI_TESTNET]: 43113,
  [CHAIN_TYPE.OPT_TESTNET]: 420,
  [CHAIN_TYPE.ARB_TESTNET]: 421613,
  [CHAIN_TYPE.FANTOM_TESTNET]: 4002,
  [CHAIN_TYPE.MOONBEAM_TESTNET]: 1287,

  [CHAIN_TYPE.ETHEREUM]: 1,
  [CHAIN_TYPE.BINANCE]: 56,
  [CHAIN_TYPE.POLYGON]: 137,
  [CHAIN_TYPE.AVALANCHE]: 43114,
  [CHAIN_TYPE.ARBITRUM]: 42161,
  [CHAIN_TYPE.OPTIMISM]: 10,
  [CHAIN_TYPE.FANTOM]: 250,

  [CHAIN_TYPE.APTOS]: 2222,
  [CHAIN_TYPE.MOONBEAM]: 1287,
}

export const CHAIN_NAMES = {
  [CHAIN_IDS[CHAIN_TYPE.GOERLI]]: CHAIN_TYPE.GOERLI,
  [CHAIN_IDS[CHAIN_TYPE.BSC_TESTNET]]: CHAIN_TYPE.BSC_TESTNET,
  [CHAIN_IDS[CHAIN_TYPE.MUMBAI]]: CHAIN_TYPE.MUMBAI,
  [CHAIN_IDS[CHAIN_TYPE.FUJI_TESTNET]]: CHAIN_TYPE.FUJI_TESTNET,
  [CHAIN_IDS[CHAIN_TYPE.OPT_TESTNET]]: CHAIN_TYPE.OPT_TESTNET,
  [CHAIN_IDS[CHAIN_TYPE.ARB_TESTNET]]: CHAIN_TYPE.ARB_TESTNET,
  [CHAIN_IDS[CHAIN_TYPE.FANTOM_TESTNET]]: CHAIN_TYPE.FANTOM_TESTNET,
  [CHAIN_IDS[CHAIN_TYPE.MOONBEAM_TESTNET]]: CHAIN_TYPE.MOONBEAM_TESTNET,

  [CHAIN_IDS[CHAIN_TYPE.ETHEREUM]]: CHAIN_TYPE.ETHEREUM,
  [CHAIN_IDS[CHAIN_TYPE.BINANCE]]: CHAIN_TYPE.BINANCE,
  [CHAIN_IDS[CHAIN_TYPE.POLYGON]]: CHAIN_TYPE.POLYGON,
  [CHAIN_IDS[CHAIN_TYPE.AVALANCHE]]: CHAIN_TYPE.AVALANCHE,
  [CHAIN_IDS[CHAIN_TYPE.ARBITRUM]]: CHAIN_TYPE.ARBITRUM,
  [CHAIN_IDS[CHAIN_TYPE.OPTIMISM]]: CHAIN_TYPE.OPTIMISM,
  [CHAIN_IDS[CHAIN_TYPE.FANTOM]]: CHAIN_TYPE.FANTOM,
}

export const RPC_PROVIDERS: { [key: number]: string } = {
  // MAINNET RPC
  [CHAIN_IDS[CHAIN_TYPE.ETHEREUM]]: 'https://rpc.ankr.com/eth',
  [CHAIN_IDS[CHAIN_TYPE.BINANCE]]: 'https://bsc-dataseed.binance.org/',
  [CHAIN_IDS[CHAIN_TYPE.POLYGON]]: 'https://polygon-rpc.com',
  [CHAIN_IDS[CHAIN_TYPE.AVALANCHE]]: 'https://api.avax.network/ext/bc/C/rpc',
  [CHAIN_IDS[CHAIN_TYPE.ARBITRUM]]: 'https://arb1.arbitrum.io/rpc',
  [CHAIN_IDS[CHAIN_TYPE.OPTIMISM]]: 'https://mainnet.optimism.io',
  [CHAIN_IDS[CHAIN_TYPE.FANTOM]]: 'https://rpcapi.fantom.network',

  // TESTNET RPC
  [CHAIN_IDS[CHAIN_TYPE.GOERLI]]: 'https://rpc.ankr.com/eth_goerli',
  [CHAIN_IDS[CHAIN_TYPE.BSC_TESTNET]]: 'https://nd-018-909-554.p2pify.com/3fc24d27a5441c18c45d56a82df3e515',
  [CHAIN_IDS[CHAIN_TYPE.FUJI_TESTNET]]: 'https://api.avax-test.network/ext/bc/C/rpc',
  [CHAIN_IDS[CHAIN_TYPE.MUMBAI]]: 'https://nd-887-934-654.p2pify.com/4caff699e2f0daa9d3af087933e7e78e',
  [CHAIN_IDS[CHAIN_TYPE.ARB_TESTNET]]: 'https://convincing-clean-reel.arbitrum-goerli.discover.quiknode.pro/a7679fef301ca865c612a70bf2c98bc17c37135f/',
  [CHAIN_IDS[CHAIN_TYPE.OPT_TESTNET]]: 'https://rpc.ankr.com/optimism_testnet',
  [CHAIN_IDS[CHAIN_TYPE.FANTOM_TESTNET]]: 'https://nd-448-597-476.p2pify.com/33e5615fa247ab10f8f59ceded9136aa',
  [CHAIN_IDS[CHAIN_TYPE.MOONBEAM_TESTNET]]: 'https://rpc.testnet.moonbeam.network'
}

export const SUPPORTED_CHAIN_IDS = [
  CHAIN_IDS[CHAIN_TYPE.GOERLI],
  CHAIN_IDS[CHAIN_TYPE.BSC_TESTNET],
  CHAIN_IDS[CHAIN_TYPE.FUJI_TESTNET],
  CHAIN_IDS[CHAIN_TYPE.MUMBAI],
  CHAIN_IDS[CHAIN_TYPE.ARB_TESTNET],
  CHAIN_IDS[CHAIN_TYPE.OPT_TESTNET],
  CHAIN_IDS[CHAIN_TYPE.FANTOM_TESTNET],
  CHAIN_IDS[CHAIN_TYPE.MOONBEAM_TESTNET],
]

export const GAS_SUPPORTED_CHAIN_IDS = [
  CHAIN_IDS[CHAIN_TYPE.ETHEREUM],
  CHAIN_IDS[CHAIN_TYPE.BINANCE],
  CHAIN_IDS[CHAIN_TYPE.AVALANCHE],
  CHAIN_IDS[CHAIN_TYPE.POLYGON],
  CHAIN_IDS[CHAIN_TYPE.OPTIMISM],
  CHAIN_IDS[CHAIN_TYPE.FANTOM],
]

export const getChainIcons = (chainId: number) => {
  if (SUPPORTED_CHAIN_IDS.includes(chainId)) {
    return {
      icon: chainInfos[chainId].roundedLogo,
      explorer: chainInfos[chainId].explorerLogo,
    }
  }
  return {
    icon: chainInfos[1].roundedLogo,
    explorer: chainInfos[1].explorerLogo,
  }
}

export const chainInfos: { [key: number]: { name: string; roundedLogo: string, explorerLogo: string, darkIcon?: string, officialName: string, currency: string, comingSoon?: boolean } } = {
  1: {
    name: 'eth',
    roundedLogo: '/images/chain/ethereum.svg',
    explorerLogo: '/images/ethereumExplorer.png',
    darkIcon: '/images/chain/ethereum_dark.svg',
    officialName: 'Ethereum',
    currency: 'ETH'
  },
  56: {
    name: 'bsc',
    roundedLogo: '/images/chain/binance.svg',
    explorerLogo: '/images/binanceExplorer.png',
    darkIcon: '/images/chain/binance_dark.svg',
    officialName: 'Binance',
    currency: 'FTM'
  },
  137: {
    name: 'polygon',
    roundedLogo: '/images/chain/polygon.svg',
    explorerLogo: '/images/polygonExplorer.png',
    darkIcon: '/images/chain/polygon_dark.svg',
    officialName: 'Polygon',
    currency: 'FTM'
  },
  43114: {
    name: 'avalanche',
    roundedLogo: '/images/chain/avalanche.svg',
    explorerLogo: '/images/avalancheExplorer.png',
    darkIcon: '/images/chain/avalanche_dark.svg',
    officialName: 'Avalanche',
    currency: 'FTM'
  },
  250: {
    name: 'fantom',
    roundedLogo: '/images/chain/fantom.svg',
    explorerLogo: '/images/fantomExplorer.png',
    darkIcon: '/images/chain/fantom_dark.svg',
    officialName: 'Fantom',
    currency: 'FTM'
  },
  10: {
    name: 'optimism',
    roundedLogo: '/images/chain/optimism.svg',
    explorerLogo: '/images/optimismExplorer.png',
    darkIcon: '/images/chain/optimism_dark.svg',
    officialName: 'Optimism',
    currency: 'FTM'
  },
  42161: {
    name: 'arbitrum',
    roundedLogo: '/images/chain/arbitrum.svg',
    explorerLogo: '/images/arbitrumExplorer.png',
    darkIcon: '/images/chain/arbitrum_dark.svg',
    officialName: 'Arbitrum',
    currency: 'FTM'
  },
  [CHAIN_IDS[CHAIN_TYPE.GOERLI]]: {
    name: 'goerli',
    roundedLogo: '/images/chain/ethereum.svg',
    explorerLogo: '/images/ethereumExplorer.png',
    darkIcon: '/images/chain/ethereum_dark.svg',
    officialName: 'Goerli',
    currency: 'GoerliETH'
  },
  [CHAIN_IDS[CHAIN_TYPE.BSC_TESTNET]]: {
    name: 'bsc testnet',
    roundedLogo: '/images/chain/binance.svg',
    explorerLogo: '/images/binanceExplorer.png',
    darkIcon: '/images/chain/binance_dark.svg',
    officialName: 'BSC',
    currency: 'BNB'
  },
  [CHAIN_IDS[CHAIN_TYPE.FUJI_TESTNET]]: {
    name: 'fuji',
    roundedLogo: '/images/chain/avalanche.svg',
    explorerLogo: '/images/avalancheExplorer.png',
    darkIcon: '/images/chain/avalanche_dark.svg',
    officialName: 'Fuji',
    currency: 'AVAX'
  },
  [CHAIN_IDS[CHAIN_TYPE.MUMBAI]]: {
    name: 'mumbai',
    roundedLogo: '/images/chain/polygon.svg',
    explorerLogo: '/images/polygonExplorer.png',
    darkIcon: '/images/chain/polygon_dark.svg',
    officialName: 'Mumbai',
    currency: 'MATIC'
  },
  [CHAIN_IDS[CHAIN_TYPE.ARB_TESTNET]]: {
    name: 'arbitrum-goerli',
    roundedLogo: '/images/chain/arbitrum.svg',
    explorerLogo: '/images/arbitrumExplorer.png',
    darkIcon: '/images/chain/arbitrum_dark.svg',
    officialName: 'Arbitrum',
    currency: 'ArbETH'
  },
  [CHAIN_IDS[CHAIN_TYPE.OPT_TESTNET]]: {
    name: 'optimism-goerli',
    roundedLogo: '/images/chain/optimism.svg',
    explorerLogo: '/images/optimismExplorer.png',
    darkIcon: '/images/chain/optimism_dark.svg',
    officialName: 'Optimism',
    currency: 'ETH'
  },
  [CHAIN_IDS[CHAIN_TYPE.FANTOM_TESTNET]]: {
    name: 'fantom-testnet',
    roundedLogo: '/images/chain/fantom.svg',
    explorerLogo: '/images/fantomExplorer.png',
    darkIcon: '/images/chain/fantom_dark.svg',
    officialName: 'Fantom',
    currency: 'FTM'
  },
  [CHAIN_IDS[CHAIN_TYPE.MOONBEAM_TESTNET]]: {
    name: 'moonbeam-testnet',
    roundedLogo: '/images/chain/moonbeam.svg',
    explorerLogo: '/images/moonbeamExplorer.png',
    darkIcon: '/images/chain/moonbeam_dark.svg',
    officialName: 'Moonbeam',
    currency: 'DEV'
  },
  2222: {
    name: 'aptos-testnet',
    roundedLogo: '/images/chain/aptos.svg',
    explorerLogo: '/images/chain/aptos.svg',
    officialName: 'Aptos',
    currency: 'APT',
    comingSoon: true
  }
}

export const getLayerzeroChainId = (chainId: number): number => {
  return chainIds[chainId.toString()]
}

export const chain_list: { [key: string]: number } = {
  'eth': 1,
  'bsc': 56,
  'matic': 137,
  'avalanche': 43114,
  'fantom': 250,
  'optimism': 10,
  'arbitrum': 42161,
  'bsc testnet': 97,
  'rinkeby': 4,
  'goerli': 5,
  'mumbai': 80001,
  'avalanche testnet': 43113,
  'arbitrum-rinkeby': 421611,
  'arbitrum-goerli': 421613,
  'optimism-kovan': 69,
  'optimism-goerli': 420,
  'fantom-testnet': 4002,
  'moonbeam-testnet': 1287,
}

export const supportChainIDs = [5, 80001, 43113, 421613, 420, 4002, 97, 1287]

export const chain_list_: { [key: number]: string } = {
  1: 'eth ',
  56: 'bsc',
  137: 'matic',
  43114: 'avalanche',
  250: 'fantom',
  10: 'optimism',
  42161: 'arbitrum',
  97: 'bsc testnet',
  4: 'rinkeby',
  5: 'goerli',
  80001: 'mumbai',
  43113: 'avalanche testnet',
  421611: 'arbitrum-rinkeby',
  69: 'optimism-kovan',
  4002: 'fantom-testnet',
  420: 'optimism-goerli',
  421613: 'arbitrum-goerli',
  1287: 'moonbeam-testnet'
}


export const getChainNameFromId = (id: number): string => {
  return chain_list_[id]
}

export const getProvider = (chainId: number) => {
  const rpcURL = RPC_PROVIDERS[chainId]
  return new ethers.providers.JsonRpcProvider(
    rpcURL,
    {
      name: chainInfos[chainId].name,
      chainId: chainId,
    }
  )
}

export const getChainInfo = (chainId: number | undefined) => {
  if (chainId === undefined) {
    return null
  }
  const filter = CHAINS.filter((item) => item.chainId === chainId)
  if (filter.length > 0) {
    return filter[0]
  }
  return null
}


export const numberShortify = (price: string | number | undefined, decimal?: number) => {
  if (!price) return '0'
  const decimalized = Number(price)

  if (decimal === 0) {
    if (Math.abs(decimalized) / 1e12 >= 1) return `${(~~(decimalized / 1e12))}T`
    if (Math.abs(decimalized) / 1e9 >= 1) return `${(~~(decimalized / 1e9))}B`
    if (Math.abs(decimalized) / 1e6 >= 1) return `${(~~(decimalized / 1e6))}M`
    if (Math.abs(decimalized) / 1000 >= 1) return `${(~~(decimalized / 1e3)).toLocaleString()}`

    return ~~decimalized
  }
  else {
    if (decimalized / 1e12 >= 1) return `${(~~(decimalized / 1e9) / 1e3)}T`
    if (decimalized / 1e9 >= 1) return `${(~~(decimalized / 1e6) / 1e3)}B`
    if (decimalized / 1e6 >= 1) return `${(~~(decimalized / 1e3) / 1e3)}M`
    if (decimalized / 1000 >= 1) return `${(~~decimalized / 1000).toLocaleString()}`

    return decimalized
  }
}

export const longNumberShortify = (price: string | number | undefined) => {
  if (!price) return '0'
  const e12 = ethers.utils.parseUnits('1', 12)
  const e9 = ethers.utils.parseUnits('1', 9)
  const e6 = ethers.utils.parseUnits('1', 6)
  const e3 = ethers.utils.parseUnits('1', 3)

  const decimalized = BigNumber.from(price)

  if (decimalized.div(e12).gte(1)) return `${(~~(decimalized.div(e9).toNumber()) / 1e3)}T`
  if (decimalized.div(e9).gte(1)) return `${(~~(decimalized.div(e6).toNumber()) / 1e3)}B`
  if (decimalized.div(e6).gte(1)) return `${(~~(decimalized.div(e3).toNumber()) / 1e3)}M`
  if (decimalized.div(e3).gte(1)) return `${((~~decimalized.toNumber()).toLocaleString())}`

  return decimalized.toLocaleString()
}

export const numberLocalize = (price: number) => {
  if (price && price < 0) return '0'
  return price.toLocaleString()
}

export const getProfileLink = (chain_id: number, owner: string) => {
  const explorer_link = getBlockExplorer(chain_id)
  return (explorer_link + '/address/' + owner)
}

export const getChainOfficialNameById = (chainId?: number) => {
  return chainId && chainInfos[chainId]?.officialName
}

export const getChainLogoById = (chainId?: string) => {
  return chainId && chainInfos[Number(chainId)]?.roundedLogo
}

export const getDarkChainIconById = (chainId?: string) => {
  return chainId && chainInfos[Number(chainId)]?.darkIcon
}

export const getBlockExplorer = (chainId: number) => {
  const chainInfo = getChainInfo(chainId)
  if (chainInfo) {
    return chainInfo.explorers?.[0]?.url
  }
  return null
}

export const supportChains = () => {
  const allChains = supportChainIDs.map((chainId) => {
    const chainInfo = getChainInfo(chainId)
    if (chainInfo) {
      return {
        id: Number(chainInfo.chainId),
        name: chainInfo.name,
        network: chainInfo.shortName,
        nativeCurrency: chainInfo.nativeCurrency,
        rpcUrls: {
          default: {
            http: [chainInfo.rpc.length > 0 ? chainInfo.rpc[0] : '']
          }
        },
        blockExplorers: chainInfo.explorers?.length ? {
          default: {
            name: chainInfo.explorers[0].name,
            url: chainInfo.explorers[0].url,
          }
        } : null,
        testnet: true,
      } as Chain
    }
    return null
  })
  return allChains.filter((chain) => chain !== null) as Chain[]
}

export const GELATO_SUPPORT_CHAINS = {
  [CHAIN_IDS[CHAIN_TYPE.GOERLI]]: true,
  [CHAIN_IDS[CHAIN_TYPE.BSC_TESTNET]]: false,
  [CHAIN_IDS[CHAIN_TYPE.MUMBAI]]: true,
  [CHAIN_IDS[CHAIN_TYPE.FUJI_TESTNET]]: false,
  [CHAIN_IDS[CHAIN_TYPE.OPT_TESTNET]]: true,
  [CHAIN_IDS[CHAIN_TYPE.ARB_TESTNET]]: false,
  [CHAIN_IDS[CHAIN_TYPE.FANTOM_TESTNET]]: false,
  [CHAIN_IDS[CHAIN_TYPE.MOONBEAM_TESTNET]]: false
}

export const isSupportGelato = (chainId: number) => {
  return (GELATO_SUPPORT_CHAINS as any)[chainId] || false
}
