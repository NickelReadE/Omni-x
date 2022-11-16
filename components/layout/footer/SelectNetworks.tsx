import React, {Fragment} from 'react'
import {
  GAS_SUPPORTED_CHAIN_IDS,
  getChainLogoById,
  getChainOfficialNameById,
} from '../../../utils/constants'
import {Menu, Transition} from '@headlessui/react'

export const SelectNetworks = ({ gasSupportChainIds, updateGasChainId }: {gasSupportChainIds: number[], updateGasChainId: (chainId: number) => void }) => {

  return (
    <div>
      <Menu as="div" className="relative inline-block align-middle">
        {({ open }) => (
          <>
            <Menu.Button className={'focus:outline-none'}>
              <div className={''}>
                <img src={`/images/icons/${open ? 'vertical' : 'horizontal'}-dots.png`} alt={'dots'} />
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
                className={'absolute bottom-10 left-[-12px] w-[166px] origin-bottom-left rounded-md bg-primary-gradient p-[1px]'}>
                <Menu.Items
                  className="bg-[#202020e6] rounded-md shadow-lg backdrop-blur-[10px] shadow-[0_0px_20px_rgba(231,237,245,0.25)] focus:outline-none py-1">
                  {
                    GAS_SUPPORTED_CHAIN_IDS.map((chainId, index) => {
                      return (
                        <Menu.Item key={index} as={Fragment}>
                          <div className={`py-2 px-6 flex items-center cursor-pointer ${gasSupportChainIds.includes(chainId) ? 'bg-[#303030]' : ''}`} onClick={() => updateGasChainId(chainId)}>
                            <img alt={'chainIcon'} src={getChainLogoById(chainId.toString())}/>
                            <span className={'text-primary-light text-lg pl-4'}>{getChainOfficialNameById(chainId)}</span>
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
