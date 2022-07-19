import React, {useEffect} from 'react'
import Image from 'next/image'
import NFTGrid from './NFTGrid'
import WatchList from './WatchList'
import Feed from './Feed'
import Stats from './Stats'
import pfp from '../public/images/image 29.png'
import image_19 from '../public/images/image 19.png'
import {FeedItem} from '../interface/interface'
import useWallet from '../hooks/useWallet'
import {useDispatch, useSelector} from 'react-redux'
import {getUserNFTs, selectUserNFTs} from '../redux/reducers/userReducer'

const feed: Array<FeedItem> = [
  {
    postedby: 'boobavelli.eth',
    id: '#3648',
    title: 'tiny dinos',
    owner: 'seaviva.eth',
    image: <Image src={image_19} alt="image - 25" layout="responsive" width={500} height={500}/>,
    chain: 'ETH',
    love: 24500,
    view: 12200,
    alert: {
      content: 'alert: collection 24 hr volume',
      percent: 257
    }
  },
  {
    postedby: 'boobavelli.eth',
    id: '#3648',
    title: 'tiny dinos',
    owner: 'seaviva.eth',
    image: <Image src={image_19} alt="image - 25" layout="responsive" width={500} height={500}/>,
    chain: 'ETH',
    love: 24500,
    view: 12200,
  },
  {
    postedby: 'boobavelli.eth',
    id: '#3648',
    title: 'tiny dinos',
    owner: 'seaviva.eth',
    image: <Image src={image_19} alt="image - 25" layout="responsive" width={500} height={500}/>,
    chain: 'ETH',
    love: 24500,
    view: 12200,
  },
]

type TabProps = {
  blur: boolean,
}

const Tabs = ({blur}: TabProps) => {
  const [currentTab, setCurrentTable] = React.useState<string>('NFTs')
  const dispatch = useDispatch()

  const {
    address
  } = useWallet()

  const nfts = useSelector(selectUserNFTs)

  useEffect(() => {
    if (address) {
      dispatch(getUserNFTs(address) as any)
    }
  }, [address])

  return (
    <>
      <div className={`w-full mt-20 px-32 ${blur ? 'blur-sm' : ''} mb-20`}>
        <div className="px-12">
          <ul
            className="flex flex-wrap relative justify-item-stretch text-sm font-medium text-center text-gray-500 border-b-4 border-gray-300 dark:border-gray-700 dark:text-gray-400 px-8">
            <li
              className={`select-none inline-block border-2 border-zince-800 text-xl p-4 text-zinc-800 ${currentTab === 'NFTs' ? 'bg-slate-200' : 'bg-slate-100'} rounded-t-lg active dark:bg-gray-800 dark:text-blue-500 w-40 cursor-pointer`}
              onClick={() => setCurrentTable('NFTs')}>
              NFTs
            </li>
            <li className={`select-none inline-block border-2 border-zince-800 text-xl p-4 text-zinc-800 ${currentTab==='watchlist'?'bg-slate-200':'bg-slate-100'} rounded-t-lg active dark:bg-gray-800 dark:text-blue-500 w-40 cursor-pointer`} onClick={()=>setCurrentTable('watchlist')}>watchlist</li>
            <li className={'select-none inline-block border-2 border-zince-800 text-xl p-4 text-zinc-800 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500 w-40'}>feed</li>
            <li className={'select-none border-2 border-zince-800 text-xl p-4 text-zinc-800 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500 w-40'}>stats</li>
            <li className='select-none border-2 bg-slate-200 font-semibold absolute right-0 justify-self-end border-zince-800 text-xl p-4 text-zinc-600 bg-slate-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-200 w-40'>settings</li>
          </ul>
          {currentTab === 'NFTs' && <NFTGrid nfts={nfts}/>}
          {currentTab === 'watchlist' && <WatchList/>}
          {/* {currentTab === 'feed' && <Feed feed={feed} />} */}
          {currentTab === 'feed' && <div/>}
          {currentTab === 'stats' && <Stats/>}
        </div>
      </div>
    </>
  )
}

export default Tabs
