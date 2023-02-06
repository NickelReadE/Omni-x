/* eslint-disable react-hooks/exhaustive-deps */
import {ReactNode, useEffect} from 'react'
import { PendingTxType, ContractContext } from '../../contexts/contract'
import { getERC1155Instance, getERC721Instance, getCurrencyInstance, getOmnixBridge1155Instance, getOmnixBridgeInstance, getONFTCore1155Instance, getONFTCore721Instance } from '../../utils/contracts'
import useWallet from '../../hooks/useWallet'
import useProgress from '../../hooks/useProgress'
import { ethers } from 'ethers'
import useData from '../../hooks/useData'
import {Logger} from 'ethers/lib/utils'
import {Slide, toast} from 'react-toastify'

type ContractProviderProps = {
  children?: ReactNode
}

export const ContractProvider = ({
  children,
}: ContractProviderProps): JSX.Element => {
  const { address, provider, chainId } = useWallet()
  const { updateHistory } = useProgress()
  const { refreshUserNfts } = useData()
  const UPDATE_TIMESTAMP = 10000

  const listenBridgeONFTCoreEvents = async (txInfo: PendingTxType, historyIndex: number) => {
    if (address && chainId && !txInfo.destTxHash) {
      if (txInfo.contractType === 'ERC721') {
        const targetCoreInstance = getONFTCore721Instance(txInfo.targetAddress, txInfo.targetChainId, null)
        const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)

        const eventExist = events.filter((ev) => {
          return ev.args?._toAddress.toLowerCase() === address.toLowerCase()
            && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem?.token_id || '0')
        })
        if (eventExist.length === 0) {
          targetCoreInstance.on('ReceiveFromChain', async () => {
            const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
            const eventExist = events.filter((ev) => {
              return ev.args?._toAddress.toLowerCase() === address.toLowerCase()
                && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem?.token_id || '0')
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
              refreshUserNfts()
            }, UPDATE_TIMESTAMP)
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
            && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem?.token_id || '0')
            && parseInt(ev.args?._amount) === parseInt(txInfo.nftItem?.amount || '0')
        })
        if (eventExist.length === 0) {
          targetCoreInstance.on('ReceiveFromChain', async () => {
            const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
            const eventExist = events.filter((ev) => {
              return ev.args?._toAddress.toLowerCase() === address?.toLowerCase()
                && ev.args?._tokenId === txInfo.nftItem?.token_id
                && ev.args?._amount === txInfo.nftItem?.amount
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
              refreshUserNfts()
            }, UPDATE_TIMESTAMP)
          })
        } else {
          updateHistory(historyIndex, {
            ...txInfo, ...{
              destTxHash: eventExist[0].transactionHash
            }
          })
        }
      }
    }
  }

  const listenBridgeEvents = async (txInfo: PendingTxType, historyIndex: number) => {
    if (address && chainId && !txInfo.destTxHash) {
      if (txInfo.contractType === 'ERC721') {
        const noSignerOmniXInstance = getOmnixBridgeInstance(txInfo.targetChainId, null)
        const events = await noSignerOmniXInstance.queryFilter(noSignerOmniXInstance.filters.LzReceive(), txInfo.targetBlockNumber)
        const eventExist = events.filter((ev) => {
          return ev.args?.toAddress.toLowerCase() === address?.toLowerCase()
            && ev.args?.tokenId.toString() === txInfo.nftItem?.token_id
        })

        if (eventExist.length === 0) {
          noSignerOmniXInstance.on('LzReceive', async () => {
            const events = await noSignerOmniXInstance.queryFilter(noSignerOmniXInstance.filters.LzReceive(), txInfo.targetBlockNumber)
            const eventExist = events.filter((ev) => {
              return ev.args?.toAddress.toLowerCase() === address?.toLowerCase()
                && ev.args?.tokenId.toString() === txInfo.nftItem?.token_id
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
              refreshUserNfts()
            }, UPDATE_TIMESTAMP)
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
            && ev.args?.tokenId.toString() === txInfo.nftItem?.token_id
            // && ev.args?.amount.toString() === txInfo.nftItem.amount
        })

        if (eventExist.length === 0) {
          noSignerOmniX1155Instance.on('LzReceive', async () => {
            const events = await noSignerOmniX1155Instance.queryFilter(noSignerOmniX1155Instance.filters.LzReceive(), txInfo.targetBlockNumber)
            const eventExist = events.filter((ev) => {
              return ev.args?.toAddress.toLowerCase() === address?.toLowerCase()
                && ev.args?.tokenId.toString() === txInfo.nftItem?.token_id
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
                refreshUserNfts()
              }, UPDATE_TIMESTAMP)
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

  const listenTradingONFTCoreEvents = async (txInfo: PendingTxType, historyIndex: number) => {
    const txObj = (ev: any) => (txInfo.lastTxAvailable ? {
      lastTxHash: ev.transactionHash
    } : {
      txHash: txInfo.txHash || ev.transactionHash,
      destTxHash: txInfo.destTxHash || ev.transactionHash
    })

    if (address && chainId && (!txInfo.destTxHash || !txInfo.txHash)) {
      if (txInfo.contractType === 'ERC721') {
        const targetCoreInstance = getONFTCore721Instance(txInfo.targetAddress, txInfo.targetChainId, null)
        const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)

        const eventExist = events.filter((ev) => {
          return ev.args?._toAddress.toLowerCase() === address.toLowerCase()
            && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem?.token_id || '0')
        })
        if (eventExist.length === 0) {
          targetCoreInstance.on('ReceiveFromChain', async () => {
            const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
            const eventExist = events.filter((ev) => {
              return ev.args?._toAddress.toLowerCase() === address.toLowerCase()
                && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem?.token_id || '0')
            })
            if (eventExist.length > 0) {
              updateHistory(historyIndex, {
                ...txInfo,
                ...txObj(eventExist[0])
              })
            }
            setTimeout(() => {
              refreshUserNfts()
            }, UPDATE_TIMESTAMP)
          })
        } else {
          updateHistory(historyIndex, {
            ...txInfo,
            ...txObj(eventExist[0])
          })
        }
      } else if (txInfo.contractType === 'ERC1155') {
        const targetCoreInstance = getONFTCore1155Instance(txInfo.targetAddress, txInfo.targetChainId, null)
        const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
        const eventExist = events.filter((ev) => {
          return ev.args?._toAddress.toLowerCase() === address?.toLowerCase()
            && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem?.token_id || '0')
            && parseInt(ev.args?._amount) === parseInt(txInfo.nftItem?.amount || '0')
        })
        if (eventExist.length === 0) {
          targetCoreInstance.on('ReceiveFromChain', async () => {
            const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
            const eventExist = events.filter((ev) => {
              return ev.args?._toAddress.toLowerCase() === address?.toLowerCase()
                && ev.args?._tokenId === txInfo.nftItem?.token_id
                && ev.args?._amount === txInfo.nftItem?.amount
            })
            if (eventExist.length > 0) {
              updateHistory(historyIndex,{
                ...txInfo,
                ...txObj(eventExist[0])
              })
            }
            setTimeout(() => {
              refreshUserNfts()
            }, UPDATE_TIMESTAMP)
          })
        } else {
          updateHistory(historyIndex, {
            ...txInfo,
            ...txObj(eventExist[0])
          })
        }
      }
    }
  }
  const listenTradingNFTEvents = async (txInfo: PendingTxType, historyIndex: number, isONFTCore: boolean) => {
    if (address && txInfo.senderAddress && (!txInfo.destTxHash || !txInfo.txHash)) {
      const isTradingEvent721 = (ev: any) => {
        if (isONFTCore) {
          return ev.args?.to.toLowerCase() === ethers.constants.AddressZero
            && parseInt(ev.args?.tokenId) === parseInt(txInfo.nftItem?.token_id || '0')
        }
        return ev.args?.to.toLowerCase() === address.toLowerCase()
              && parseInt(ev.args?.tokenId) === parseInt(txInfo.nftItem?.token_id || '0')
      }

      const isTradingEvent1155 = (ev: any) => {
        if (isONFTCore) {
          return ev.args?.to.toLowerCase() === ethers.constants.AddressZero
            && parseInt(ev.args?.tokenId) === parseInt(txInfo.nftItem?.token_id || '0')
            && ev.args?.amount === txInfo.nftItem?.amount
        }
        return ev.args?.to.toLowerCase() === address.toLowerCase()
          && parseInt(ev.args?.tokenId) === parseInt(txInfo.nftItem?.token_id || '0')
          && ev.args?.amount === txInfo.nftItem?.amount
      }

      if (txInfo.contractType === 'ERC721') {
        const sellerNftInstance = getERC721Instance(txInfo.senderAddress, txInfo.senderChainId, null)
        const events = await sellerNftInstance.queryFilter(sellerNftInstance.filters.Transfer(), txInfo.senderBlockNumber)
        const eventExist = events.filter((ev) => isTradingEvent721(ev))
        if (eventExist.length === 0) {
          sellerNftInstance.on('Transfer', async () => {
            const events = await sellerNftInstance.queryFilter(sellerNftInstance.filters.Transfer(), txInfo.senderBlockNumber)
            const eventExist = events.filter((ev) => isTradingEvent721(ev))
            if (eventExist.length > 0) {
              txInfo.txHash = txInfo.txHash || eventExist[0].transactionHash
              txInfo.destTxHash = txInfo.destTxHash || eventExist[0].transactionHash
              updateHistory(historyIndex, {
                ...txInfo
              })
            }
            setTimeout(() => {
              refreshUserNfts()
            }, UPDATE_TIMESTAMP)
          })
        } else {
          txInfo.txHash = txInfo.txHash || eventExist[0].transactionHash
          txInfo.destTxHash = txInfo.destTxHash || eventExist[0].transactionHash
          updateHistory(historyIndex, {
            ...txInfo
          })
        }
      } else if (txInfo.contractType === 'ERC1155') {
        const sellerNftInstance = getERC1155Instance(txInfo.senderAddress, txInfo.senderChainId, null)
        const events = await sellerNftInstance.queryFilter(sellerNftInstance.filters.TransferSingle(), txInfo.senderBlockNumber)
        const eventExist = events.filter((ev) => isTradingEvent1155(ev))
        if (eventExist.length === 0) {
          sellerNftInstance.on('TransferSingle', async () => {
            const events = await sellerNftInstance.queryFilter(sellerNftInstance.filters.TransferSingle(), txInfo.senderBlockNumber)
            const eventExist = events.filter((ev) => isTradingEvent1155(ev))
            if (eventExist.length > 0) {
              txInfo.txHash = txInfo.txHash || eventExist[0].transactionHash
              txInfo.destTxHash = txInfo.destTxHash || eventExist[0].transactionHash
              updateHistory(historyIndex,{
                ...txInfo
              })
            }
            setTimeout(() => {
              refreshUserNfts()
            }, UPDATE_TIMESTAMP)
          })
        } else {
          txInfo.txHash = txInfo.txHash || eventExist[0].transactionHash
          txInfo.destTxHash = txInfo.destTxHash || eventExist[0].transactionHash
          updateHistory(historyIndex, {
            ...txInfo,
          })
        }
      }
    }
  }
  const listenTradingFundEvents = async (txInfo: PendingTxType, historyIndex: number, isSameChain: boolean) => {
    if (address && txInfo.targetAddress && (!txInfo.destTxHash || !txInfo.txHash)) {
      const isTradingEvent20 = (ev: any) => {
        if (isSameChain) {
          return ev.args?.to.toLowerCase() === address?.toLowerCase()
        }
        return ev.args?.to.toLowerCase() === ethers.constants.AddressZero
      }

      const bidderCurrencyInstance = getCurrencyInstance(txInfo.targetAddress, txInfo.targetChainId, null)
      if (bidderCurrencyInstance) {
        const events = await bidderCurrencyInstance.queryFilter(bidderCurrencyInstance.filters.Transfer(), txInfo.targetBlockNumber)
        const eventExist = events.filter((ev) => isTradingEvent20(ev))
        if (eventExist.length === 0) {
          bidderCurrencyInstance.on('Transfer', async () => {
            const events = await bidderCurrencyInstance.queryFilter(bidderCurrencyInstance.filters.Transfer(), txInfo.targetBlockNumber)
            const eventExist = events.filter((ev) => isTradingEvent20(ev))
            if (eventExist.length > 0) {
              txInfo.txHash = txInfo.txHash || eventExist[0].transactionHash
              txInfo.destTxHash = txInfo.destTxHash || eventExist[0].transactionHash
              updateHistory(historyIndex, {
                ...txInfo
              })
            }
            setTimeout(() => {
              refreshUserNfts()
            }, UPDATE_TIMESTAMP)
          })
        } else {
          txInfo.txHash = txInfo.txHash || eventExist[0].transactionHash
          txInfo.destTxHash = txInfo.destTxHash || eventExist[0].transactionHash
          updateHistory(historyIndex, {
            ...txInfo
          })
        }
      }
    }
  }
  const listenGaslessMintNFTEvents = async (txInfo: PendingTxType, historyIndex: number) => {
    if (address && txInfo.senderAddress && !txInfo.txHash) {
      const isMintEvent721 = (ev: any) => {
        return ev.args?.to.toLowerCase() === address.toLowerCase()
              && ev.args?.from.toLowerCase() === ethers.constants.AddressZero
      }

      const isMintEvent1155 = (ev: any) => {
        return ev.args?.to.toLowerCase() === address.toLowerCase()
          && ev.args?.from.toLowerCase() === ethers.constants.AddressZero
          && ev.args?.amount === txInfo.nftItem?.amount
      }

      if (txInfo.contractType === 'ERC721') {
        const sellerNftInstance = getERC721Instance(txInfo.senderAddress, txInfo.senderChainId, null)
        const events = await sellerNftInstance.queryFilter(sellerNftInstance.filters.Transfer(), txInfo.senderBlockNumber)
        const eventExist = events.filter((ev) => isMintEvent721(ev))
        if (eventExist.length === 0) {
          sellerNftInstance.on('Transfer', async () => {
            const events = await sellerNftInstance.queryFilter(sellerNftInstance.filters.Transfer(), txInfo.senderBlockNumber)
            const eventExist = events.filter((ev) => isMintEvent721(ev))
            if (eventExist.length > 0) {
              txInfo.txHash = eventExist[0].transactionHash
              updateHistory(historyIndex, {
                ...txInfo
              })
            }
            setTimeout(() => {
              refreshUserNfts()
            }, UPDATE_TIMESTAMP)
          })
        } else {
          txInfo.txHash = eventExist[0].transactionHash
          updateHistory(historyIndex, {
            ...txInfo
          })
        }
      } else if (txInfo.contractType === 'ERC1155') {
        const sellerNftInstance = getERC1155Instance(txInfo.senderAddress, txInfo.senderChainId, null)
        const events = await sellerNftInstance.queryFilter(sellerNftInstance.filters.TransferSingle(), txInfo.senderBlockNumber)
        const eventExist = events.filter((ev) => isMintEvent1155(ev))
        if (eventExist.length === 0) {
          sellerNftInstance.on('TransferSingle', async () => {
            const events = await sellerNftInstance.queryFilter(sellerNftInstance.filters.TransferSingle(), txInfo.senderBlockNumber)
            const eventExist = events.filter((ev) => isMintEvent1155(ev))
            if (eventExist.length > 0) {
              txInfo.txHash = eventExist[0].transactionHash
              updateHistory(historyIndex,{
                ...txInfo
              })
            }
            setTimeout(() => {
              refreshUserNfts()
            }, UPDATE_TIMESTAMP)
          })
        } else {
          txInfo.txHash = eventExist[0].transactionHash
          updateHistory(historyIndex, {
            ...txInfo,
          })
        }
      }
    }
  }
  const listenONFTEvents = async (txInfo: PendingTxType, historyIndex: number) => {
    if (txInfo.type === 'bridge') {
      if (txInfo.isONFTCore) {
        await listenBridgeONFTCoreEvents(txInfo, historyIndex)
      } else {
        await listenBridgeEvents(txInfo, historyIndex)
      }
    } else if (txInfo.type === 'buy') {
      if (txInfo.isONFTCore && txInfo.senderChainId != txInfo.targetChainId) {
        if (txInfo.lastTxAvailable) {
          await listenTradingNFTEvents(txInfo, historyIndex, txInfo.isONFTCore)
        }
        await listenTradingONFTCoreEvents(txInfo, historyIndex)
      } else {
        await listenTradingNFTEvents(txInfo, historyIndex, txInfo.isONFTCore)
      }
    } else if (txInfo.type === 'accept') {
      await listenTradingFundEvents(txInfo, historyIndex, txInfo.senderChainId == txInfo.targetChainId)
    } else if (txInfo.type === 'gaslessMint') {
      await listenGaslessMintNFTEvents(txInfo, historyIndex)
    }
  }

  const errorToast = (error: string): void => {
    toast.error(error, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      transition: Slide
    })
  }

  const errorHandler = (error: any) => {
    if (error.code && error.code === Logger.errors.ACTION_REJECTED) {
      errorToast('User denied transaction signature')
    }
  }

  useEffect(() => {
    (async () => {
      if (address && chainId) {
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
        listenONFTEvents,
        errorHandler
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}
