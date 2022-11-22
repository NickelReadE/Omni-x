import React, {Fragment} from 'react'
import {Menu, Transition} from '@headlessui/react'
import HomeLogo from '../../../public/images/icons/home_logo.svg'
import ProcessingTransaction from '../../transaction/ProcessingTransaction'
import useProgress from '../../../hooks/useProgress'

export const TransactionTracker = () => {
  const { pending, histories, clearHistories } = useProgress()
    
  const onClear = () => {
    clearHistories()
  }
    
  return (
    <div className=''>
      <Menu as="div" className="relative flex items-center">
        <>
          <Menu.Button as="div" className={'focus:outline-none'}>
            <button className='flex items-center'>
              <HomeLogo />
            </button>
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
              className={'absolute top-[50px] left-0 w-[166px] origin-top-left rounded-md bg-primary-gradient p-[1px]'}>
              <Menu.Items
                className="bg-[#202020e6] rounded-md shadow-lg backdrop-blur-[10px] shadow-[0_0px_20px_rgba(231,237,245,0.25)] focus:outline-none py-2">
                {
                  histories.length > 0 &&
                  <div className={'absolute right-[250px] h-[64px] flex items-center'}>
                    <div className={'relative'}>
                      <Menu>
                        <Menu.Button className={'w-[250px] h-[40px] bg-[#F6F8FC] px-[18px] flex items-center justify-between outline-0'} style={{ borderRadius: '20px', border: '1.5px solid #000000'}}>
                          <div className={'flex items-center'}>
                            {pending ? 'processing' : 'last transactions'}
                            {
                              pending
                                ?
                                <img width={24} height={24} src={'/images/omnix_loading.gif'} style={{marginLeft: 10}} alt="nft-image" />
                                :
                                <img width={24} height={24} src={'/images/omnix_logo_black_1.png'} style={{marginLeft: 10}} alt="nft-image" />
                            }
                          </div>
                          <div className={'flex items-center'}>
                            <img width={15} height={15} src={'/images/refresh_round.png'} onClick={onClear} alt="nft-image" />
                            <img width={10} height={6} src={'/images/arrowDown.png'} style={{marginLeft: 10}} alt="nft-image" />
                          </div>
                        </Menu.Button>

                        <Menu.Items className={'absolute top-0 w-[250px] bg-white outline-0'} style={{ borderRadius: '20px', border: '1.5px solid #000000'}}>
                          <div className={'h-[38px] bg-[#F6F8FC] px-[18px] flex items-center justify-between'} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px'}}>
                            <div className={'flex items-center'}>
                              {pending ? 'processing' : 'last transactions'}
                              {
                                pending
                                  ?
                                  <img width={24} height={24} src={'/images/omnix_loading.gif'} style={{marginLeft: 10}} alt="nft-image" />
                                  :
                                  <img width={24} height={24} src={'/images/omnix_logo_black_1.png'} style={{marginLeft: 10}} alt="nft-image" />
                              }
                            </div>
                            <div className={'flex items-center'}>
                              <img width={10} height={6} src={'/images/arrowUp.png'} alt="nft-image" />
                            </div>
                          </div>
                          <div className='overflow-y-auto overflow-x-hidden max-h-[280px]'>
                            {
                              histories.map((item, index) => {
                                return (
                                  <Menu.Item key={index}>
                                    <ProcessingTransaction txInfo={item} />
                                  </Menu.Item>
                                )
                              })
                            }
                          </div>
                        </Menu.Items>
                      </Menu>
                    </div>
                  </div>
                }
              </Menu.Items>
            </div>
          </Transition>
        </>
      </Menu>
    </div>
  )
}
