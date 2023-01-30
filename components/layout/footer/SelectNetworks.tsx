import React, {useState, Fragment} from 'react'
import {Menu, Transition} from '@headlessui/react'
import {
  GAS_SUPPORTED_CHAIN_IDS,
  getChainLogoById,
  getChainOfficialNameById,
} from '../../../utils/constants'
import {GradientBackground} from '../../common/Basic'

export const SelectNetworks = ({ gasSupportChainIds, updateGasChainId }: {gasSupportChainIds: number[], updateGasChainId: (chainId: number) => void }) => {

  const [hover, setHover] = useState(false)

  return (
    <div>
      <Menu as="div" className="relative inline-block align-middle flex items-center">
        {({ open }) => (
          <>
            <Menu.Button className={'focus:outline-none w-5 h-5'} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
              <div className={`${open ? 'rotate-90' : ''} duration-300 flex items-center justify-center`}>
                <svg width="19" height="3" viewBox="0 0 19 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 1.5C11 0.671573 10.3284 0 9.5 0C8.67157 0 8 0.671573 8 1.5C8 2.32843 8.67157 3 9.5 3C10.3284 3 11 2.32843 11 1.5Z" fill={!open ? (hover ? '#00F0EC' : '#969696'): '#00F0EC'}/>
                  <path d="M4 1.5C4 0.671573 3.32843 0 2.5 0C1.67157 0 1 0.671573 1 1.5C1 2.32843 1.67157 3 2.5 3C3.32843 3 4 2.32843 4 1.5Z" fill={!open ? (hover ? '#00F0EC' : '#969696'): '#00F0EC'}/>
                  <path d="M18 1.5C18 0.671573 17.3284 0 16.5 0C15.6716 0 15 0.671573 15 1.5C15 2.32843 15.6716 3 16.5 3C17.3284 3 18 2.32843 18 1.5Z" fill={!open ? (hover ? '#00F0EC' : '#969696'): '#00F0EC'}/>
                </svg>
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
                className={'absolute bottom-10 left-[-12px] w-[166px] origin-bottom-left rounded-md'}>
                <GradientBackground className="shadow-[0_0px_20px_rgba(231,237,245,0.25)]">
                  <Menu.Items className="focus:outline-none py-1">
                    {
                      GAS_SUPPORTED_CHAIN_IDS.map((chainId, index) => {
                        return (
                          <Menu.Item key={index} as={Fragment}>
                            <div className={`py-2 px-6 flex items-center cursor-pointer ${gasSupportChainIds.includes(chainId) ? '' : 'bg-[#303030]'}`} onClick={() => updateGasChainId(chainId)}>
                              <img alt={'chainIcon'} src={getChainLogoById(chainId.toString())}/>
                              <span className={'text-primary-light text-lg pl-4'}>{getChainOfficialNameById(chainId)}</span>
                            </div>
                          </Menu.Item>
                        )
                      })
                    }
                  </Menu.Items>
                </GradientBackground>
              </div>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}
