import React from 'react'
import {DndContext} from '@dnd-kit/core'
import {WalletProvider} from './WalletProvider'
import {BridgeProvider} from './providers/BridgeProvider'
import {ProgressProvider} from './providers/ProgressProvider'
import {ContractProvider} from './providers/ContractProvider'
import { MoralisProvider } from 'react-moralis'
import Layout from './Layout'

const MORALIS_SERVER_URL = process.env.NEXT_MORALIS_SERVER_URL || 'https://9b3skk0haj33.grandmoralis.com:2053/server'
const MORALIS_APP_ID = process.env.NEXT_MORALIS_APP_ID || '0BU7yNfbYcvrcWEAsD35Ty3CMRJhPvgcVCacmam5'
const MORALIS_SECRET = process.env.NEXT_MORALIS_SECRET || 'ErEG80UwJVJ0dQ2mdKweipKGeXWcOKCcSF5R87xD2H92tZeeQKT0hyACfDXPFBNp'

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
