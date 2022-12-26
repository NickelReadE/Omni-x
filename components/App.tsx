import React from 'react'
import {DndContext} from '@dnd-kit/core'
import {ToastContainer} from 'react-toastify'
import {WalletProvider} from './providers/WalletProvider'
import {BridgeProvider} from './providers/BridgeProvider'
import {DataProvider} from './providers/DataProvider'
import {ProgressProvider} from './providers/ProgressProvider'
import {ContractProvider} from './providers/ContractProvider'
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
import Layout from './layout/Layout'
import {supportChains} from '../utils/constants'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { SwitchedNetworkProvider } from './SwitchedNetworkProvider'
import { ModalProvider } from './providers/ModalProvider'
import {TransferProvider} from './providers/TransferProvider'
import '@rainbow-me/rainbowkit/styles.css'
import 'react-toastify/dist/ReactToastify.css'
import {MessageProvider} from './providers/MessageProvider'

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
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={darkTheme({
          accentColor: '#623485',
          accentColorForeground: 'black',
          borderRadius: 'large',
          fontStack: 'system',
        })}
        >
          <ToastContainer />
          <WalletProvider>
            <BridgeProvider>
              <MessageProvider>
                <DataProvider>
                  <TransferProvider>
                    <ProgressProvider>
                      <ContractProvider>
                        <DndContext>
                          <SwitchedNetworkProvider>
                            <ModalProvider>
                              <Layout>{children}</Layout>
                            </ModalProvider>
                          </SwitchedNetworkProvider>
                        </DndContext>
                      </ContractProvider>
                    </ProgressProvider>
                  </TransferProvider>
                </DataProvider>
              </MessageProvider>
            </BridgeProvider>
          </WalletProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </React.StrictMode>

  )
}

export default App
