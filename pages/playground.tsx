import React from 'react'
import type { NextPage } from 'next'
import {GreyButton} from '../components/common/buttons/GreyButton'
import {PrimaryButton} from '../components/common/buttons/PrimaryButton'
import {SecondaryButton} from '../components/common/buttons/SecondaryButton'
import CollectionCard from '../components/home/CollectionCard'
import NFTBox from '../components/collections/NFTBox'

const mockCollectionData = {
  profile_image: 'https://i.seadn.io/gae/P6E401quk1vxYSEWZ9N4BXbVMSQX5Hg6k05lw_th2IjFA9CjxUpCVJ7c-Jp4_eIsD4e6cHrB6cEf4Vwu0M7QzggNZa8IAYdTpsuU?auto=format&w=256',
  col_url: 'kanpai_pandas',
  name: 'Kanpai Pandas',
  itemsCnt: 2863,
  ownerCnt: 1063,
  floorPrice: {
    omni: 250
  }
}

const mockNFTItem = {
  name: 'Kanpai Panda',
  attributes: '',
  image: 'https://ipfs.io/ipfs/bafybeifyh6chm3o5gp7wxvkdpd2sxlumjouwtdafegtc7o3q42v2jdeg2a',
  custom_id: 6583,
  token: '',
  score: 0,
  rank: 0,
  token_id: '6583',
  name1: '',
  price: 2400,
  last_sale: 2200,
  last_sale_currency:'0xb45186E02CC4AbC0e390EdFfdc2aBC8D523ea15e',
  chain_id: 5,
  metadata: '',
  token_uri: '',
  amount: '',
  contract_type: '',
  chain: '',
  token_address: '',
  owner: '',
  collection_address: '',
  currency: '',
  uri: '',
  symbol: '',
  order_data: '',
  bidDatas: [],
  bidOrderData: [],
}

const PlayGround: NextPage = () => {

  const onRefresh = () => {
    console.log('onRefresh')
  }
    
  return (
    <>
      <div className={'flex space-x-4'}>
        <GreyButton text={'button'} />
        <PrimaryButton text={'button'} />
        <SecondaryButton text={'button'} />
      </div>
        
      <div className={'mt-4'}>
        <CollectionCard collection={mockCollectionData} />
      </div>
        
      <div className={'mt-4'}>
        <NFTBox nft={mockNFTItem} onRefresh={onRefresh} />
      </div>
    </>
  )
}

export default PlayGround
