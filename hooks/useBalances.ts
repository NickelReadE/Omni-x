import { ethers } from 'ethers'
import { useEffect,useState } from 'react'
import { useDispatch } from 'react-redux'
import { openSnackBar } from '../redux/reducers/snackBarReducer'
import { ContractName, getAddressByName, getDecimalsByAddress } from '../utils/constants'
import { getCurrencyInstance, getOmniInstance, getUSDCInstance } from '../utils/contracts'
import useWallet from './useWallet'

export type BalancesInformation = {
  omni: number,
  usdc: number,
  usdt: number,
}

type BalancesType = {
  balances: BalancesInformation,
  updateRefresh: () => void,
  faucet: () => Promise<void>,
}

const useBalances = (): BalancesType => {
  const { chainId, address, signer } = useWallet()
  const dispatch = useDispatch()

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
              const decimal = getDecimalsByAddress(chainId, usdcAddress)
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
              const decimal = getDecimalsByAddress(chainId, usdtAddress)
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

  const faucet = async () => {
    if (!signer || !chainId) return

    // faucet omni
    try {
      const omni = getOmniInstance(chainId, signer)

      const tx = await omni.mint({ gasLimit: '300000' })
      await tx.wait()

      dispatch(openSnackBar({ message: 'Received 10,000 OMNI', status: 'success' }))
    } catch (e) {
      console.error('While fauceting OMNI token', e)
    }

    // faucet usdc/usdt
    try {
      let currencyName: ContractName = 'USDC'
      let currencyAddr = getAddressByName(currencyName, chainId)
      if (!currencyAddr) {
        currencyName = 'USDT'
        currencyAddr = getAddressByName(currencyName, chainId)
      }

      const usdc = getUSDCInstance(currencyAddr, chainId, signer)
      if (usdc) {
        const decimal = getDecimalsByAddress(chainId, currencyAddr)
        const tx = await usdc.mint(await signer.getAddress(), ethers.utils.parseUnits('25000', decimal), { gasLimit: '300000' })
        await tx.wait()
  
        dispatch(openSnackBar({ message: `Received 1,000 $${currencyName}`, status: 'success' }))
      }
      else {
        dispatch(openSnackBar({ message: `Not support $${currencyName} on this chain`, status: 'warning' }))
      }
    } catch (e) {
      console.error('While fauceting USDC/USDT token', e)
    }

    updateRefresh()
  }

  const updateRefresh = () => {
    setRefresh(!refresh)
  }

  return {
    balances,
    updateRefresh,
    faucet,
  }
}

export default useBalances
