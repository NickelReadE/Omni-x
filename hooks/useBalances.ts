import { ethers } from 'ethers'
import { useEffect,useState } from 'react'
import { getAddressByName, STABLECOIN_DECIMAL } from '../utils/constants'
import { getCurrencyInstance } from '../utils/contracts'
import useWallet from './useWallet'

export type BalancesInformation = {
  omni: number,
  usdc: number,
  usdt: number,
}

type BalancesType = {
  balances: BalancesInformation,
  updateRefresh: () => void,
}

const useBalances = (): BalancesType => {
  const { chainId, address, signer } = useWallet()

  const [refresh, setRefresh] = useState<boolean>(false)
  const [balances, setBalances] = useState<BalancesInformation>({
    omni: 0,
    usdc: 0,
    usdt: 0,
  })

  useEffect(() => {
    (async () => {
      if (chainId && address && signer) {
        const newBalances = {
          omni: 0,
          usdc: 0,
          usdt: 0,
        }

        setBalances({
          omni: newBalances.omni,
          usdc: newBalances.usdc,
          usdt: newBalances.usdt,
        })

        try {
          const omniContract = getCurrencyInstance(getAddressByName('OMNI', chainId), chainId, signer)
          const balance = await omniContract?.balanceOf(address)
          newBalances.omni = Number(ethers.utils.formatUnits(balance, 18))
        } catch (error) {
          console.error('Error while fetching OMNI balance', error)
        }

        try {
          {
            const usdcAddress = getAddressByName('USDC', chainId)
            const usdContract = getCurrencyInstance(usdcAddress, chainId, signer)
            const balance = await usdContract?.balanceOf(address)
            if (balance) {
              const decimal = STABLECOIN_DECIMAL[chainId][usdcAddress] || 6
              newBalances.usdc = Number(ethers.utils.formatUnits(balance, decimal))
            }
          }
        } catch (error) {
          console.error('Error while fetching USDC balance', error)
        }

        try {
          {
            const usdtAddress = getAddressByName('USDT', chainId)
            const usdContract = getCurrencyInstance(usdtAddress, chainId, signer)
            const balance = await usdContract?.balanceOf(address)
            if (balance) {
              const decimal = STABLECOIN_DECIMAL[chainId][usdtAddress] || 6
              newBalances.usdt = Number(ethers.utils.formatUnits(balance, decimal))
            }
          }
        } catch (error) {
          console.error('Error while fetching USDT balance', error)
        }

        setBalances({
          omni: newBalances.omni,
          usdc: newBalances.usdc,
          usdt: newBalances.usdt,
        })
      }
    })()
  }, [signer, address, chainId, refresh])

  const updateRefresh = () => {
    setRefresh(!refresh)
  }

  return {
    balances,
    updateRefresh,
  }
}

export default useBalances
