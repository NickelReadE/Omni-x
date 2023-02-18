import {useMemo, useEffect, useState } from 'react'
import {useConnectModal} from '@rainbow-me/rainbowkit'
import NavMenu from './NavMenu'
import useData from '../../../hooks/useData'
import SearchBar from './SearchBar'
import useWallet from '../../../hooks/useWallet'
import classNames from '../../../helpers/classNames'
import {SelectNetworks} from './SelectNetworks'
import {PfpMenu} from './PfpMenu'
import {TransactionTracker} from './TransactionTracker'
import {getImageProperLink} from '../../../utils/helpers'
import { CHAIN_IDS, supportChainIDs } from '../../../utils/constants'
import {useSwitchNetwork} from 'wagmi'

const Header = (): JSX.Element => {
  const { address, chainId } = useWallet()
  const { profile, onFaucet } = useData()
  const { openConnectModal } = useConnectModal()
  const [isConnectedWarning, setIsConnectedWarning] = useState<boolean>(false)
  const {switchNetwork} = useSwitchNetwork()

  const onConnect = () => {
    if (!address && openConnectModal) {
      openConnectModal()
    }
  }

  // check if the connected chain is among the supported ones. if not, trigger the warning to pop
  useEffect(()=>{
    if(chainId && supportChainIDs.includes(chainId)){
      console.log(chainId)
      setIsConnectedWarning(false)
    } else setIsConnectedWarning(true)
  },[chainId])

  // disable the warning if the user is not connected
  useEffect(() => {
    if (address === undefined) {
      setIsConnectedWarning(false)
    }
    console.log(address)
  }, [address])


  const avatarImage = useMemo(() => {
    if (profile && profile.avatar) {
      return getImageProperLink(profile.avatar)
    }
    return '/images/default_avatar.png'
  }, [profile])

  return (
    <>
      <nav className={
        classNames(
          'bg-[#161616]',
          'z-50',
          'fixed',
          'w-full',
        )}
      >
        <div className='flex items-center text-[16px] font-medium px-8'>
          <div className={'flex items-center flex-1 space-x-[50px] md:w-auto mx-auto'}>
            <TransactionTracker />
            <NavMenu />
          </div>

          <div className='flex flex-1 items-center justify-center mr-auto'>
            <SearchBar />
          </div>

          <div className='flex flex-1 items-center justify-end ml-2 space-x-[20px]'>
            {
              address ?
                <>
                  <div className={'h-9 bg-primary-gradient text-primary px-4 py-[9px] flex items-center justify-center rounded-md cursor-pointer'} onClick={onFaucet}>$USD</div>
                  <SelectNetworks />
                  {/* <MessageArea /> */}
                  {/* <NotificationArea /> */}
                  <PfpMenu avatarImage={avatarImage} />
                </>
                :
                <div className={'w-[100px] h-[40px] bg-primary-gradient text-primary px-[16px] py-[9px] flex items-center justify-center rounded-md cursor-pointer'} onClick={onConnect}>connect</div>
            }
          </div>
        </div>
        <div className={`bg-red-600 min-w-full h-8 px-6 justify-center items-center flex ${isConnectedWarning ? '' : 'hidden'}`}>
          <span className='text-white'>
            Your crypto wallet is currently connected to an unsupported network. 
            <a onClick={() => switchNetwork?.(CHAIN_IDS['goerli'])} className='mx-1 cursor-pointer underline'>Click here</a>
            to connect to Goerli testnet
          </span>
        </div>
      </nav>
    </>
  )
}

export default Header
