import {useState, ReactNode} from 'react'
import {BigNumber} from 'ethers'
import {PendingTxType, ProgressContext} from '../../contexts/progress'

type ProgressProviderProps = {
    children?: ReactNode
}

export const ProgressProvider = ({
  children,
}: ProgressProviderProps): JSX.Element => {

  const [pending, setPending] = useState<boolean>(false)
  const [txInfo, setTxInfo] = useState<PendingTxType | null>(null)

  const estimateGasFee = async () => {
    return BigNumber.from('1')
  }

  const setPendingTxInfo = async (txInfo: PendingTxType | null) => {
    if (txInfo === null) {
      setPending(false)
      setTxInfo(null)
    } else {
      setPending(true)
      setTxInfo(txInfo)
    }
  }

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
