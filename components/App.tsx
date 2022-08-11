import React from 'react'
import {DndContext} from '@dnd-kit/core'
import {WalletProvider} from './WalletProvider'
import {BridgeProvider} from './providers/BridgeProvider'
import {ProgressProvider} from './providers/ProgressProvider'
import Layout from './Layout'

type AppProps = {
    children?: React.ReactNode
}

function App({children}: AppProps) {
  return (
    <WalletProvider>
      <BridgeProvider>
        <ProgressProvider>
          <DndContext>
            <Layout>{children}</Layout>
          </DndContext>
        </ProgressProvider>
      </BridgeProvider>
    </WalletProvider>
  )
}

export default App
