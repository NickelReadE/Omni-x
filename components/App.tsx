import React from 'react'
import {DndContext} from '@dnd-kit/core'
import {WalletProvider} from './WalletProvider'
import {BridgeProvider} from './providers/BridgeProvider'
import {ProgressProvider} from './providers/ProgressProvider'
import {ContractProvider} from './providers/ContractProvider'
import { MoralisProvider } from 'react-moralis'
import Layout from './Layout'

const MORALIS_SERVER_URL = process.env.MORALIS_SERVER_URL || ''
const MORALIS_APP_ID = process.env.MORALIS_APP_ID || ''
const MORALIS_SECRET = process.env.MORALIS_SECRET || ''

type AppProps = {
    children?: React.ReactNode
}

function App({children}: AppProps) {
  return (
    <React.StrictMode>
      <MoralisProvider serverUrl={MORALIS_SERVER_URL} appId={MORALIS_APP_ID} jsKey={MORALIS_SECRET}>
        <WalletProvider>
          <BridgeProvider>
            <ProgressProvider>
              <ContractProvider>
                <DndContext>
                  <Layout>{children}</Layout>
                </DndContext>
              </ContractProvider>
            </ProgressProvider>
          </BridgeProvider>
        </WalletProvider>
      </MoralisProvider>
    </React.StrictMode>

  )
}

export default App
