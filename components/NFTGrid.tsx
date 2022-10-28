/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react'
import NFTBox from './collections/NFTBox'
import {IPropsImage, NFTItem} from '../interface/interface'
import {chainInfos, SUPPORTED_CHAIN_IDS} from '../utils/constants'
import {ChainIds} from '../types/enum'
import useData from '../hooks/useData'
import Loading from './Loading'
import Dropdown from './dropdown'

const sortMenu = [
  { text: 'A - Z', value: 'name' },
  { text: 'Z - A', value: '-name' },
  { text: 'last sold', value: 'lastSale' },
  { text: 'price ascending', value: 'price' },
  { text: 'price descending', value: '-price' },
]

const NFTGrid = ({nfts, isLoading}: IPropsImage) => {
  const [chain, setChain] = useState(-1)
  const [sortedItems, setSortedItems] = useState<Array<NFTItem>>(nfts)

  const { refreshUserNfts } = useData()

  useEffect(() => {
    const namedNftItems = [...nfts].map((item) => {
      return {
        ...item,
        newName: JSON.parse(item.metadata || '{}')?.name
      }
    })
    const hasNameItems = [...namedNftItems].filter((item) => item.newName)
    const hasNoNameItems = [...namedNftItems].filter((item) => !item.newName)
    setSortedItems(hasNameItems.sort((a, b) => a.newName.localeCompare(b.newName)).concat(hasNoNameItems))
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
        <div className="flex relative justify-start bg-[#F8F9FA] pl-2 w-fit" style={{'width': '100%'}}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
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
            </div>
            <Dropdown menus={sortMenu} onChange={onChangeSort} />
          </div>
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
                    key={index}
                    onRefresh={onRefresh}
                  />
                )
              } else {
                if (chain == item.chain_id) {
                  return (
                    <NFTBox
                      nft={item}
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
