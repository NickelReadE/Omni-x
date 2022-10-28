import React from 'react'
import {DndContext} from '@dnd-kit/core'
import {WalletProvider} from './WalletProvider'
import {BridgeProvider} from './providers/BridgeProvider'
import {DataProvider} from './providers/DataProvider'
import {ProgressProvider} from './providers/ProgressProvider'
import {ContractProvider} from './providers/ContractProvider'
import { MoralisProvider } from 'react-moralis'
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit'
import {
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import Layout from './Layout'
import {supportChains} from '../utils/constants'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { SwitchedNetworkProvider } from './SwitchedNetworkProvider'

const MORALIS_SERVER_URL = process.env.MORALIS_SERVER_URL || ''
const MORALIS_APP_ID = process.env.MORALIS_APP_ID || ''
const MORALIS_SECRET = process.env.MORALIS_SECRET || ''

const supportedChains = supportChains()

const { chains, provider } = configureChains(
  supportedChains,
  [
    infuraProvider({ apiKey: process.env.INFURA_API_KEY }),
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => {
        return { http: chain.rpcUrls.default }
      },
    }),
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'OmniX Marketplace',
  chains
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

type AppProps = {
    children?: React.ReactNode
}

function App({children}: AppProps) {
  return (
    <React.StrictMode>
      <MoralisProvider serverUrl={MORALIS_SERVER_URL} appId={MORALIS_APP_ID} jsKey={MORALIS_SECRET}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains} theme={darkTheme({
            accentColor: '#623485', //color of wallet  try #703844
            accentColorForeground: 'black',
            borderRadius: 'large',
            fontStack: 'system',
          })}
          >
            <WalletProvider>
              <BridgeProvider>
                <DataProvider>
                  <ProgressProvider>
                    <ContractProvider>
                      <DndContext>
                        <SwitchedNetworkProvider>
                          <Layout>{children}</Layout>
                        </SwitchedNetworkProvider>
                      </DndContext>
                    </ContractProvider>
                  </ProgressProvider>
                </DataProvider>
              </BridgeProvider>
            </WalletProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </MoralisProvider>
    </React.StrictMode>

  )
}

export default App
