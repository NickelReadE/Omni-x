import {useState, ReactNode, useEffect} from 'react'
import {BigNumber, Contract} from 'ethers'
import {PendingTxType, ProgressContext} from '../../contexts/progress'
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

        if (txInfo.type === 'bridge') {
          if (txInfo.isONFTCore) {
            let targetCoreInstance: Contract
            if (txInfo.contractType === 'ERC721') {
              targetCoreInstance = getONFTCore721Instance(txInfo.targetAddress, txInfo.targetChainId, null)
              const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
              const eventExist = events.filter((ev) => {
                return ev.args?._toAddress.toLowerCase() === address?.toLowerCase()
                  && ev.args?._srcAddress.toLowerCase() === txInfo.nftItem.token_address.toLowerCase()
                  && ev.args?._tokenId === txInfo.nftItem.token_id
              })
              if (eventExist.length === 0) {
                targetCoreInstance.on('ReceiveFromChain', () => {
                  setPendingTxInfo(null)
                  if (address) {
                    setTimeout(() => {
                      dispatch(getUserNFTs(address) as any)
                    }, 30000)
                  }
                })
                setPending(true)
                setTxInfo(txInfo)
              } else {
                localStorage.removeItem('pendingTxInfo')
              }
            } else if (txInfo.contractType === 'ERC1155') {
              targetCoreInstance = getONFTCore1155Instance(txInfo.targetAddress, txInfo.targetChainId, null)
              const events = await targetCoreInstance.queryFilter(targetCoreInstance.filters.ReceiveFromChain(), txInfo.targetBlockNumber)
              const eventExist = events.filter((ev) => {
                return ev.args?._toAddress.toLowerCase() === address?.toLowerCase()
                  && ev.args?._srcAddress.toLowerCase() === txInfo.nftItem.token_address.toLowerCase()
                  && ev.args?._tokenId === txInfo.nftItem.token_id
                  && ev.args?._amount === txInfo.nftItem.amount
              })
              if (eventExist.length === 0) {
                targetCoreInstance.on('ReceiveFromChain', () => {
                  setPendingTxInfo(null)
                  if (address) {
                    setTimeout(() => {
                      dispatch(getUserNFTs(address) as any)
                    }, 30000)
                  }
                })
              } else {
                localStorage.removeItem('pendingTxInfo')
              }
            }
          } else {
            if (txInfo.contractType === 'ERC721') {
              const noSignerOmniXInstance = getOmnixBridgeInstance(txInfo.targetChainId, null)
              const events = await noSignerOmniXInstance.queryFilter(noSignerOmniXInstance.filters.LzReceive(), txInfo.targetBlockNumber)
              const eventExist = events.filter((ev) => {
                return ev.args?.ercAddress.toLowerCase() === txInfo.nftItem.token_address.toLowerCase()
                  && ev.args?.toAddress === address
                  && ev.args?.tokenId.toString() === txInfo.nftItem.token_id
              })

              if (eventExist.length === 0) {
                noSignerOmniXInstance.on('LzReceive', async () => {
                  setPendingTxInfo(null)
                  if (address) {
                    setTimeout(() => {
                      dispatch(getUserNFTs(address) as any)
                    }, 30000)
                  }
                })
                setPending(true)
                setTxInfo(txInfo)
              } else {
                localStorage.removeItem('pendingTxInfo')
              }
            } else if (txInfo.contractType === 'ERC1155') {
              const noSignerOmniX1155Instance = getOmnixBridge1155Instance(txInfo.targetChainId, null)
              const events = await noSignerOmniX1155Instance.queryFilter(noSignerOmniX1155Instance.filters.LzReceive(), txInfo.targetBlockNumber)
              const eventExist = events.filter((ev) => {
                return ev.args?.ercAddress.toLowerCase() === txInfo.nftItem.token_address.toLowerCase()
                  && ev.args?.toAddress === address
                  && ev.args?.tokenId.toString() === txInfo.nftItem.token_id
                  && ev.args?.amount.toString() === txInfo.nftItem.amount
              })

              if (eventExist.length === 0) {
                noSignerOmniX1155Instance.on('LzReceive', async () => {
                  setPendingTxInfo(null)
                  if (address) {
                    setTimeout(() => {
                      dispatch(getUserNFTs(address) as any)
                    }, 30000)
                  }
                })
                setPending(true)
                setTxInfo(txInfo)
              } else {
                localStorage.removeItem('pendingTxInfo')
              }
            }
          }
        }
      }
    })()
  }, [])

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
