/* eslint-disable react-hooks/exhaustive-deps */
import {ReactNode, useEffect} from 'react'
import { PendingTxType, ContractContext } from '../../contexts/contract'
import { getOmnixBridge1155Instance, getOmnixBridgeInstance, getONFTCore1155Instance, getONFTCore721Instance } from '../../utils/contracts'
import { useDispatch } from 'react-redux'
import { getUserNFTs } from '../../redux/reducers/userReducer'
import useWallet from '../../hooks/useWallet'
import useProgress from '../../hooks/useProgress'

type ContractProviderProps = {
  children?: ReactNode
}

export const ContractProvider = ({
  children,
}: ContractProviderProps): JSX.Element => {
  const dispatch = useDispatch()
  const { address, provider } = useWallet()
  const { updateHistory } = useProgress()

  const listenONFTEvents = async (txInfo: PendingTxType, historyIndex: number) => {
    if (txInfo.type === 'bridge' && address && provider?._network?.chainId) {
      if (txInfo.isONFTCore) {
        if (txInfo.contractType === 'ERC721') {
          const targetCoreInstance = getONFTCore721Instance(txInfo.targetAddress, txInfo.targetChainId, null)
          const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
          const eventExist = events.filter((ev) => {
            return ev.args?._toAddress.toLowerCase() === address.toLowerCase()
              && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem.token_id)
          })
          if (eventExist.length === 0) {
            targetCoreInstance.on('ReceiveFromChain', async () => {
              const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
              const eventExist = events.filter((ev) => {
                return ev.args?._toAddress.toLowerCase() === address.toLowerCase()
                  && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem.token_id)
              })
              if (eventExist.length > 0) {
                updateHistory(historyIndex, {
                  ...txInfo,
                  ...{
                    destTxHash: eventExist[0].transactionHash
                  }
                })
              }
              setTimeout(() => {
                dispatch(getUserNFTs(address) as any)
              }, 30000)
            })
          } else {
            updateHistory(historyIndex, {
              ...txInfo, ...{
                destTxHash: eventExist[0].transactionHash
              }
            })
          }
        } else if (txInfo.contractType === 'ERC1155') {
          const targetCoreInstance = getONFTCore1155Instance(txInfo.targetAddress, txInfo.targetChainId, null)
          const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
          const eventExist = events.filter((ev) => {
            return ev.args?._toAddress.toLowerCase() === address?.toLowerCase()
              && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem.token_id)
              && parseInt(ev.args?._amount) === parseInt(txInfo.nftItem.amount)
          })
          if (eventExist.length === 0) {
            targetCoreInstance.on('ReceiveFromChain', async () => {
              const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
              const eventExist = events.filter((ev) => {
                return ev.args?._toAddress.toLowerCase() === address?.toLowerCase()
                  && ev.args?._tokenId === txInfo.nftItem.token_id
                  && ev.args?._amount === txInfo.nftItem.amount
              })
              if (eventExist.length > 0) {
                updateHistory(historyIndex,{
                  ...txInfo,
                  ...{
                    destTxHash: eventExist[0].transactionHash
                  }
                })
              }
              setTimeout(() => {
                dispatch(getUserNFTs(address) as any)
              }, 30000)
            })
          } else {
            updateHistory(historyIndex, {
              ...txInfo, ...{
                destTxHash: eventExist[0].transactionHash
              }
            })
          }
        }
      } else {
        if (txInfo.contractType === 'ERC721') {
          const noSignerOmniXInstance = getOmnixBridgeInstance(txInfo.targetChainId, null)
          const events = await noSignerOmniXInstance.queryFilter(noSignerOmniXInstance.filters.LzReceive(), txInfo.targetBlockNumber)
          const eventExist = events.filter((ev) => {
            return ev.args?.toAddress.toLowerCase() === address?.toLowerCase()
              && ev.args?.tokenId.toString() === txInfo.nftItem.token_id
          })

          if (eventExist.length === 0) {
            noSignerOmniXInstance.on('LzReceive', async () => {
              const events = await noSignerOmniXInstance.queryFilter(noSignerOmniXInstance.filters.LzReceive(), txInfo.targetBlockNumber)
              const eventExist = events.filter((ev) => {
                return ev.args?.toAddress.toLowerCase() === address?.toLowerCase()
                  && ev.args?.tokenId.toString() === txInfo.nftItem.token_id
              })
              if (eventExist.length > 0) {
                updateHistory(historyIndex,{
                  ...txInfo,
                  ...{
                    destTxHash: eventExist[0].transactionHash
                  }
                })
              }
              setTimeout(() => {
                dispatch(getUserNFTs(address) as any)
              }, 30000)
            })
          } else {
            updateHistory(historyIndex,{
              ...txInfo, ...{
                destTxHash: eventExist[0].transactionHash
              }
            })
          }
        } else if (txInfo.contractType === 'ERC1155') {
          const noSignerOmniX1155Instance = getOmnixBridge1155Instance(txInfo.targetChainId, null)
          const events = await noSignerOmniX1155Instance.queryFilter(noSignerOmniX1155Instance.filters.LzReceive(), txInfo.targetBlockNumber)
          const eventExist = events.filter((ev) => {
            return ev.args?.toAddress === address
              && ev.args?.tokenId.toString() === txInfo.nftItem.token_id
              // && ev.args?.amount.toString() === txInfo.nftItem.amount
          })

          if (eventExist.length === 0) {
            noSignerOmniX1155Instance.on('LzReceive', async () => {
              const events = await noSignerOmniX1155Instance.queryFilter(noSignerOmniX1155Instance.filters.LzReceive(), txInfo.targetBlockNumber)
              const eventExist = events.filter((ev) => {
                return ev.args?.toAddress.toLowerCase() === address?.toLowerCase()
                  && ev.args?.tokenId.toString() === txInfo.nftItem.token_id
                  // && ev.args?.amount.toString() === txInfo.nftItem.amount
              })
              if (eventExist.length > 0) {
                updateHistory(historyIndex, {
                  ...txInfo,
                  ...{
                    destTxHash: eventExist[0].transactionHash
                  }
                })
              }
              if (address) {
                setTimeout(() => {
                  dispatch(getUserNFTs(address) as any)
                }, 30000)
              }
            })
          } else {
            updateHistory(historyIndex,{
              ...txInfo, ...{
                destTxHash: eventExist[0].transactionHash
              }
            })
          }
        }
      }
    }
  }

  useEffect(() => {
    (async () => {
      if (address && provider?._network?.chainId) {
        const allHistories = localStorage.getItem('txHistories')
        const txInfos = allHistories ? JSON.parse(allHistories) : []
        await Promise.all(
          txInfos.map(async (txInfo: PendingTxType) => {
            await listenONFTEvents(txInfo, txInfos.indexOf(txInfo))
          })
        )
      }
    })()
  }, [address, provider])

  return (
    <ContractContext.Provider
      value={{
        listenONFTEvents
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}
