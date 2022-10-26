/* eslint-disable react-hooks/exhaustive-deps */
import {Fragment, useEffect, useState} from 'react'
import { Menu } from '@headlessui/react'
import NFTBox from './collections/NFTBox'
import {IPropsImage, NFTItem} from '../interface/interface'
import {chainInfos, SUPPORTED_CHAIN_IDS} from '../utils/constants'
import {ChainIds} from '../types/enum'
import useData from '../hooks/useData'
import Loading from './Loading'

const sortMenu = [
  { text: 'A - Z ascending', value: 'name' },
  { text: 'A - Z descending', value: '-name' },
  { text: 'last sold', value: 'lastSale' },
  { text: 'price ascending', value: 'price' },
  { text: 'price descending', value: '-price' },
]

const NFTGrid = ({nfts, isLoading}: IPropsImage) => {
  const [chain, setChain] = useState(-1)
  const [sortedItems, setSortedItems] = useState<Array<NFTItem>>(nfts)

  const { refreshUserNfts } = useData()

  useEffect(() => {
    setSortedItems(nfts)
  }, [nfts])

  const onRefresh = () => {
    refreshUserNfts()
  }

  const onChangeSort = (value: string) => {
    if (value === 'name') {
      const namedNftItems = [...nfts].map((item) => {
        return {
          ...item,
          newName: JSON.parse(item.metadata || '{}')?.name
        }
      })
      const hasNameItems = [...namedNftItems].filter((item) => item.newName)
      const hasNoNameItems = [...namedNftItems].filter((item) => !item.newName)
      setSortedItems(hasNameItems.sort((a, b) => a.newName.localeCompare(b.newName)).concat(hasNoNameItems))
    } else if (value === '-name') {
      const namedNftItems = [...nfts].map((item) => {
        return {
          ...item,
          newName: JSON.parse(item.metadata || '{}')?.name
        }
      })
      const hasNameItems = [...namedNftItems].filter((item) => item.newName)
      const hasNoNameItems = [...namedNftItems].filter((item) => !item.newName)
      setSortedItems(hasNameItems.sort((a, b) => b.newName.localeCompare(a.newName)).concat(hasNoNameItems))
    } else if (value === 'lastSale') {
      const hasLastSaleItems = [...nfts].filter((item) => item.last_sale)
      const hasNoLastSaleItems = [...nfts].filter((item) => !item.last_sale)
      setSortedItems(hasLastSaleItems.sort((a, b) => b.last_sale - a.last_sale).concat(hasNoLastSaleItems))
    } else if (value === 'price') {
      const hasPriceItems = [...nfts].filter((item) => item.price)
      const hasNoPriceItems = [...nfts].filter((item) => !item.price)
      setSortedItems(hasPriceItems.sort((a, b) => a.price - b.price).concat(hasNoPriceItems))
    } else if (value === '-price') {
      const hasPriceItems = [...nfts].filter((item) => item.price)
      const hasNoPriceItems = [...nfts].filter((item) => !item.price)
      setSortedItems(hasPriceItems.sort((a, b) => b.price - a.price).concat(hasNoPriceItems))
    }
  }

  return (
    <>
      <div className="w-full mb-5">
        <div className="flex relative justify-start bg-[#F8F9FA] pl-2 pr-2 w-fit" style={{'width': '100%'}}>
          <div
            className={`grid justify-items-center content-center p-3 font-medium cursor-pointer m-[1px] min-w-[80px] ${chain === -1 ? 'bg-[#C8D6E8]' : ''} `}
            onClick={() => {
              setChain(-1)
            }}
          >
            <img alt={'listing'} src="/svgs/all_chain.svg" className="w-[21px] h-[22px] "/>
          </div>
          {
            SUPPORTED_CHAIN_IDS.map((networkId: ChainIds, index) => {
              return <div
                key={index}
                className={`grid justify-items-center content-center p-3 font-medium cursor-pointer m-[1px] min-w-[80px] ${chain === networkId ? 'bg-[#C8D6E8]' : ''} `}
                onClick={() => {
                  setChain(networkId)
                }}
              >
                <img alt={'listing'} src={chainInfos[networkId].logo} className="w-[21px] h-[22px] "/>
              </div>
            })
          }
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button className={'absolute right-0'}>
                  <div className={`${open && 'bg-white rounded-md'} flex justify-around p-3 font-medium cursor-pointer text-[#6C757D] w-[230px]`}>
                    <img alt={'listing'} src="/images/listing.png" className="w-[21px] h-[22px]"/>
                    <span>active listing</span>
                    <img alt={'listing'} src="/images/downArrow.png" className="w-[10px] h-[7px] ml-5 mt-auto mb-auto"/>
                  </div>
                </Menu.Button>
                <Menu.Items className={'absolute right-0 z-10 top-[48px]'}>
                  {
                    sortMenu.map((item, index) => {
                      return (
                        <Menu.Item key={index} as={Fragment}>
                          {({ active }) => (
                            <div className={`${active && 'bg-gray-50'} cursor-pointer text-[#6C757D] flex items-center rounded-md h-[44px] w-[230px] bg-white pl-[60px]`} onClick={() => onChangeSort(item.value)}>
                              {item.text}
                            </div>
                          )}
                        </Menu.Item>
                      )
                    })
                  }
                </Menu.Items>
              </>
            )}
          </Menu>
        </div>
        {
          isLoading &&
          <div className='flex justify-center py-10'>
            <Loading />
          </div>
        }
        {
          !isLoading &&
          <div className="grid grid-cols-4 gap-6 2xl:grid-cols-5 2xl:gap-10 mt-4">
            {sortedItems.map((item, index) => {
              if (chain == -1) {
                return (
                  <NFTBox
                    nft={item}
                    index={index}
                    key={index}
                    onRefresh={onRefresh}
                  />
                )
              } else {
                if (chain == item.chain_id) {
                  return (
                    <NFTBox
                      nft={item}
                      index={index}
                      key={index}
                      onRefresh={onRefresh}
                    />
                  )
                }
              }
            })}
          </div>
        }
      </div>
    </>
  )
}

export default NFTGrid
