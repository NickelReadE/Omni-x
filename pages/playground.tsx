import React from 'react'
import type { NextPage } from 'next'
import {GreyButton} from '../components/common/buttons/GreyButton'
import {PrimaryButton} from '../components/common/buttons/PrimaryButton'
import {SecondaryButton} from '../components/common/buttons/SecondaryButton'
import {GradientBackground} from '../components/basic'
// import CollectionCard from '../components/home/CollectionCard'
// import NFTBox from '../components/collections/NFTBox'
//
// const mockCollectionData = {
//   profile_image: 'https://i.seadn.io/gae/P6E401quk1vxYSEWZ9N4BXbVMSQX5Hg6k05lw_th2IjFA9CjxUpCVJ7c-Jp4_eIsD4e6cHrB6cEf4Vwu0M7QzggNZa8IAYdTpsuU?auto=format&w=256',
//   col_url: 'kanpai_pandas',
//   name: 'Kanpai Pandas',
//   itemsCnt: 2863,
//   ownerCnt: 1063,
//   floorPrice: {
//     omni: 250
//   }
// }
//
// const mockNFTItem = {
//   name: 'Kanpai Panda',
//   attributes: '',
//   image: 'https://ipfs.io/ipfs/bafybeifyh6chm3o5gp7wxvkdpd2sxlumjouwtdafegtc7o3q42v2jdeg2a',
//   custom_id: 6583,
//   token: '',
//   score: 0,
//   rank: 0,
//   token_id: '6583',
//   name1: '',
//   price: 2400,
//   last_sale: 2200,
//   last_sale_currency:'0xb45186E02CC4AbC0e390EdFfdc2aBC8D523ea15e',
//   chain_id: 5,
//   metadata: '{"name":"Doodle #22","image":"ipfs://QmettMBaNbBg9PYdcVnpCEj8CEqBs2gVYAY8W54ZW8oyb6","description":"A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.","attributes":[{"value":"designer glasses","trait_type":"face"},{"value":"green mullet","trait_type":"hair"},{"value":"navy sweater","trait_type":"body"},{"value":"blue","trait_type":"background"},{"value":"blue","trait_type":"head"}]}',
//   token_uri: '',
//   amount: '',
//   contract_type: '',
//   chain: '',
//   token_address: '',
//   owner: '0x10fCee14ae57bcC87edb04458490351872310bd9',
//   collection_address: '',
//   currency: '',
//   uri: '',
//   symbol: '',
//   order_data: '',
//   bidDatas: [],
//   bidOrderData: [],
// }

const PlayGround: NextPage = () => {
  return (
    <>
      <div className={'flex space-x-4'}>
        <GreyButton text={'button'} />
        <PrimaryButton text={'button'} />
        <SecondaryButton text={'button'} />
      </div>
      <div className={'mt-[50px]'}>
        <GradientBackground>
          <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent bibendum, lorem vel tincidunt imperdiet, nibh elit laoreet felis, a bibendum nisl tortor non orci. Donec pretium fermentum felis, quis aliquet est rutrum ut. Integer quis massa ut lacus viverra pharetra in eu lacus. Aliquam tempus odio adipiscing diam pellentesque rhoncus. Curabitur a bibendum est.
          </div>
        </GradientBackground>
      </div>
    </>
  )
}

export default PlayGround
