/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react'
import NFTBox from './collections/NFTBox'
import {IPropsImage, NFTItem} from '../interface/interface'
import useData from '../hooks/useData'
import Loading from './Loading'
import Dropdown from './dropdown'
import {ChainSelection} from './common/ChainSelection'
import {SUPPORTED_CHAIN_IDS} from '../utils/constants'

const sortMenu = [
  { text: 'A - Z', value: 'name' },
  { text: 'Z - A', value: '-name' },
  { text: 'last sold', value: 'lastSale' },
  { text: 'price ascending', value: 'price' },
  { text: 'price descending', value: '-price' },
]

const NFTGrid = ({nfts, isLoading}: IPropsImage) => {
  const [selectedChainIds, setSelectedChainIds] = useState<number[]>(SUPPORTED_CHAIN_IDS)
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

  const addSelectedChainId = (chainId: number) => {
    setSelectedChainIds([...selectedChainIds, chainId])
  }

  const addAllChainIds = () => {
    setSelectedChainIds(SUPPORTED_CHAIN_IDS)
  }

  const removeSelectedChainId = (chainId: number) => {
    setSelectedChainIds(selectedChainIds.filter((id) => id !== chainId))
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
        <div className="flex relative justify-start pl-2 w-fit" style={{'width': '100%'}}>
          <div className="flex items-center justify-between w-full">
            <ChainSelection selectedChainIds={selectedChainIds} addChainId={addSelectedChainId} removeChainId={removeSelectedChainId} addAllChainIds={addAllChainIds} />
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
          <div className="grid grid-cols-4 gap-1 2xl:grid-cols-6 2xl:gap-10 mt-4">
            {sortedItems.map((item, index) => {
              if (selectedChainIds.length === 0) {
                return (
                  <NFTBox
                    nft={item}
                    key={index}
                    onRefresh={onRefresh}
                  />
                )
              } else {
                if (selectedChainIds.includes(item.chain_id)) {
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
