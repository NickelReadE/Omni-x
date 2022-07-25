import React from 'react'
import {DndContext} from '@dnd-kit/core'
import { WalletProvider } from './WalletProvider'
import {BridgeProvider} from './BridgeProvider'
import Layout from './Layout'

type AppProps = {
  children?: React.ReactNode
}

function App({ children }: AppProps) {
  return (
    <WalletProvider>
      <BridgeProvider>
        <DndContext>
          <Layout>{children}</Layout>
        </DndContext>
      </BridgeProvider>
    </WalletProvider>
  )
}

export default App
