import {useEffect, useMemo, useState} from 'react'
import {getGasOnChains, getPriceFeeddata} from '../services/datafeed'
import {CHAIN_TYPE} from '../types/enum'
import {CHAIN_IDS, getDarkChainIconById} from '../utils/constants'

export type OnChainInformation = {
  chainInfos: any[],
  gasSupportChainIds: number[],
  updateGasChainId: (chainId: number) => void
}

const useOnchainPrices = (): OnChainInformation => {
  const [assetsPrices, setAssetsPrices] = useState<any>()
  const [gasPrices, setGasPrices] = useState<any>([])
  const [gasSupportChainIds, setGasSupportChainIds] = useState<number[]>([])

  const getOnchainInfos = async () => {
    setAssetsPrices(await getPriceFeeddata(gasSupportChainIds))
    setGasPrices(await getGasOnChains(gasSupportChainIds))
  }

  const chainInfos = useMemo(() => {
    if (assetsPrices && gasPrices) {
      return gasSupportChainIds.map((chainId) => {
        return {
          icon: getDarkChainIconById(chainId.toString()),
          gasFee: gasPrices[chainId] || 0,
          price: assetsPrices[chainId] || 0,
        }
      })
    }
    return []
  }, [assetsPrices, gasPrices, gasSupportChainIds])

  const updateGasChainId = (chainId: number) => {
    if (gasSupportChainIds.includes(chainId)) {
      setGasSupportChainIds(gasSupportChainIds.filter((id) => id !== chainId).sort())
    } else {
      setGasSupportChainIds([...gasSupportChainIds, chainId].sort())
    }
  }

  useEffect(() => {
    (async () => {
      const supportedChainIdFromStorage = localStorage.getItem('gasSupportChainIds')
      setGasSupportChainIds(supportedChainIdFromStorage ? JSON.parse(supportedChainIdFromStorage) : [
        CHAIN_IDS[CHAIN_TYPE.ETHEREUM],
        CHAIN_IDS[CHAIN_TYPE.BINANCE],
        CHAIN_IDS[CHAIN_TYPE.AVALANCHE],
        CHAIN_IDS[CHAIN_TYPE.POLYGON],
        CHAIN_IDS[CHAIN_TYPE.OPTIMISM],
      ])
      await getOnchainInfos()
      const interval = setInterval(() => {
        getOnchainInfos()
      }, 30000)
      return () => clearInterval(interval)
    })()
  }, [])

  useEffect(() => {
    localStorage.setItem('gasSupportChainIds', JSON.stringify(gasSupportChainIds))
  }, [gasSupportChainIds])

  return {
    chainInfos,
    gasSupportChainIds,
    updateGasChainId
  }
}

export default useOnchainPrices
