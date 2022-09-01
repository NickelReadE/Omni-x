import { useState, ReactNode, useEffect } from 'react'
import { BigNumber, Contract } from 'ethers'
import { PendingTxType, ProgressContext } from '../../contexts/progress'
import { getOmnixBridge1155Instance, getOmnixBridgeInstance, getONFTCore1155Instance, getONFTCore721Instance } from '../../utils/contracts'
import { useDispatch } from 'react-redux'
import { getUserNFTs } from '../../redux/reducers/userReducer'
import useWallet from '../../hooks/useWallet'

type ProgressProviderProps = {
  children?: ReactNode
}

export const ProgressProvider = ({
  children,
}: ProgressProviderProps): JSX.Element => {

  // const [pending, setPending] = useState<boolean>(true)
  // const [txInfo, setTxInfo] = useState<PendingTxType | null>({
  //   txHash: '0xe1be988ec3be15a6382c337724dd80757b456664c3d9fb1326f38339ecaea5a5',
  //   destTxHash: '0xe1be988ec3be15a6382c337724dd80757b456664c3d9fb1326f38339ecaea5a5',
  //   type: 'bridge',
  //   senderChainId: 4,
  //   targetChainId: 97,
  //   targetAddress: 'string | undefined',
  //   isONFTCore: false,
  //   nftItem: null,
  //   contractType: 'ERC721',
  //   targetBlockNumber: 1111,
  //   itemName: 'asdf'
  // })
  const [pending, setPending] = useState<boolean>(false)
  const [txInfo, setTxInfo] = useState<PendingTxType | null>(null)
  const dispatch = useDispatch()
  const { address } = useWallet()

  const estimateGasFee = async () => {
    return BigNumber.from('1')
  }

  const setPendingTxInfo = async (txInfo: PendingTxType | null) => {
    if (txInfo === null) {
      setPending(false)
      setTxInfo(null)
      localStorage.removeItem('pendingTxInfo')
    } else {
      setPending(true)
      setTxInfo(txInfo)
      localStorage.setItem('pendingTxInfo', JSON.stringify(txInfo))
    }
  }

  useEffect(() => {
    (async () => {
      const pendingTxInfo = localStorage.getItem('pendingTxInfo')
      if (pendingTxInfo) {
        const txInfo = JSON.parse(pendingTxInfo)

        if (txInfo.destTxHash) {
          setPending(true)
          setTxInfo(txInfo)
          return
        }
        if (txInfo.type === 'bridge') {
          if (txInfo.isONFTCore) {
            if (txInfo.contractType === 'ERC721') {
              const targetCoreInstance = getONFTCore721Instance(txInfo.targetAddress, txInfo.targetChainId, null)
              const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
              const eventExist = events.filter((ev) => {
                return ev.args?._toAddress.toLowerCase() === address?.toLowerCase()
                  && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem.token_id)
              })
              if (eventExist.length === 0) {
                targetCoreInstance.on('ReceiveFromChain', async () => {
                  if (address) {
                    const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
                    const eventExist = events.filter((ev) => {
                      return ev.args?._toAddress.toLowerCase() === address?.toLowerCase()
                        && parseInt(ev.args?._tokenId) === parseInt(txInfo.nftItem.token_id)
                    })
                    const pendingTxInfo = localStorage.getItem('pendingTxInfo')
                    if (eventExist.length > 0 && pendingTxInfo) {
                      setPendingTxInfo({
                        ...JSON.parse(pendingTxInfo),
                        ...{
                          destTxHash: eventExist[0].transactionHash
                        }
                      })
                    }
                    setTimeout(() => {
                      dispatch(getUserNFTs(address) as any)
                    }, 30000)
                  }
                })
                setPending(true)
                setTxInfo(txInfo)
              } else {
                setTxInfo({
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
                  if (address) {
                    const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
                    const eventExist = events.filter((ev) => {
                      return ev.args?._toAddress.toLowerCase() === address?.toLowerCase()
                        && ev.args?._tokenId === txInfo.nftItem.token_id
                        && ev.args?._amount === txInfo.nftItem.amount
                    })
                    const pendingTxInfo = localStorage.getItem('pendingTxInfo')
                    if (eventExist.length > 0 && pendingTxInfo) {
                      setPendingTxInfo({
                        ...JSON.parse(pendingTxInfo),
                        ...{
                          destTxHash: eventExist[0].transactionHash
                        }
                      })
                    }
                    setTimeout(() => {
                      dispatch(getUserNFTs(address) as any)
                    }, 30000)
                  }
                })
              } else {
                setTxInfo({
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
                  const pendingTxInfo = localStorage.getItem('pendingTxInfo')
                  if (eventExist.length > 0 && pendingTxInfo) {
                    setPendingTxInfo({
                      ...JSON.parse(pendingTxInfo),
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
                setPending(true)
                setTxInfo(txInfo)
              } else {
                setTxInfo({
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
                  && ev.args?.amount.toString() === txInfo.nftItem.amount
              })

              if (eventExist.length === 0) {
                noSignerOmniX1155Instance.on('LzReceive', async () => {
                  const events = await noSignerOmniX1155Instance.queryFilter(noSignerOmniX1155Instance.filters.LzReceive(), txInfo.targetBlockNumber)
                  const eventExist = events.filter((ev) => {
                    return ev.args?.toAddress.toLowerCase() === address?.toLowerCase()
                      && ev.args?.tokenId.toString() === txInfo.nftItem.token_id
                      && ev.args?.amount.toString() === txInfo.nftItem.amount
                  })
                  const pendingTxInfo = localStorage.getItem('pendingTxInfo')
                  if (eventExist.length > 0 && pendingTxInfo) {
                    setPendingTxInfo({
                      ...JSON.parse(pendingTxInfo),
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
                setPending(true)
                setTxInfo(txInfo)
              } else {
                setTxInfo({
                  ...txInfo, ...{
                    destTxHash: eventExist[0].transactionHash
                  }
                })
              }
            }
          }
        }
      }
    })()
  }, [address, dispatch])

  return (
    <ProgressContext.Provider
      value={{
        pending,
        txInfo,
        setPendingTxInfo,
        estimateGasFee,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}
