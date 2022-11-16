import React, {Fragment} from 'react'
import {getChainLogoById, getChainOfficialNameById, SUPPORTED_CHAIN_IDS} from '../../../utils/constants'
import useWallet from '../../../hooks/useWallet'
import {Menu, Transition} from '@headlessui/react'

export const SelectNetworks = () => {
  const { chainId } = useWallet()

  return (
    <div className='w-8 h-8'>
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <Menu.Button className={'focus:outline-none'}>
              <div className={`w-8 h-8 ${open ? 'bg-primary-gradient' : ''} p-[1px] rounded-full`}>
                <img alt={'networkIcon'} src={getChainLogoById(chainId ? chainId.toString() : '5')} className="h-full w-full" />
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div
                className={'absolute right-0 w-[166px] origin-top-right rounded-md bg-primary-gradient p-[1px]'}>
                <Menu.Items
                  className="bg-[#202020e6] rounded-md shadow-lg backdrop-blur-[10px] shadow-[0_0px_20px_rgba(231,237,245,0.25)] focus:outline-none py-2">
                  {
                    SUPPORTED_CHAIN_IDS.map((chainId, index) => {
                      return (
                        <Menu.Item key={index} as={Fragment}>
                          <div className={'py-2 px-6 flex items-center'}>
                            <img alt={'chainIcon'} src={getChainLogoById(chainId.toString())}/>
                            <span className={'text-secondary text-lg pl-4'}>{getChainOfficialNameById(chainId)}</span>
                          </div>
                        </Menu.Item>
                      )
                    })
                  }
                </Menu.Items>
              </div>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}
