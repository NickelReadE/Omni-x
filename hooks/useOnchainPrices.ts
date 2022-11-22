import {useEffect, useState} from 'react'
import {getGasOnChains, getPriceFeeddata} from '../services/datafeed'
import {CHAIN_TYPE} from '../types/enum'
import {CHAIN_IDS, getDarkChainIconById} from '../utils/constants'

export type OnChainInformation = {
  chainInfos: any[],
  gasSupportChainIds: number[],
  updateGasChainId: (chainId: number) => void
}

const useOnchainPrices = (): OnChainInformation => {
  const [gasSupportChainIds, setGasSupportChainIds] = useState<number[]>(JSON.parse(localStorage.getItem('gasSupportChainIds') || JSON.stringify([
    CHAIN_IDS[CHAIN_TYPE.ETHEREUM],
    CHAIN_IDS[CHAIN_TYPE.BINANCE],
    CHAIN_IDS[CHAIN_TYPE.AVALANCHE],
    CHAIN_IDS[CHAIN_TYPE.POLYGON],
    CHAIN_IDS[CHAIN_TYPE.OPTIMISM],
  ])))
  const [chainInfos, setChainInfos] = useState<any[]>([])

  const getOnchainInfos = async () => {
    const _gasSupportChainIds = JSON.parse(localStorage.getItem('gasSupportChainIds') || '[]')
    const _assetsPrices = await getPriceFeeddata(_gasSupportChainIds)
    const _gasPrices = await getGasOnChains(_gasSupportChainIds)
    const _chainInfos = _gasSupportChainIds.map((chainId: number) => {
      return {
        chainId: chainId,
        icon: getDarkChainIconById(chainId.toString()),
        gasFee: _gasPrices[chainId] || 0,
        price: _assetsPrices[chainId] || 0,
      }
    })
    setChainInfos(_chainInfos)
  }

  const updateGasChainId = (chainId: number) => {
    if (gasSupportChainIds.includes(chainId)) {
      setGasSupportChainIds(gasSupportChainIds.filter((id) => id !== chainId).sort())
      localStorage.setItem('gasSupportChainIds', JSON.stringify(gasSupportChainIds.filter((id) => id !== chainId).sort()))
      setChainInfos(chainInfos.filter((info) => info.chainId !== chainId))
    } else {
      setGasSupportChainIds([...gasSupportChainIds, chainId].sort())
      localStorage.setItem('gasSupportChainIds', JSON.stringify([...gasSupportChainIds, chainId].sort()))
    }
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      await getOnchainInfos()
    }, 30000)
    getOnchainInfos().then(r => r)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    (async () => {
      await getOnchainInfos()
    })()
  }, [gasSupportChainIds])

  return {
    chainInfos,
    gasSupportChainIds,
    updateGasChainId
  }
}

export default useOnchainPrices
