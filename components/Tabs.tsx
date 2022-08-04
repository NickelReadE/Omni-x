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
import { makeStyles } from '@material-ui/core/styles'

import Dialog from '@material-ui/core/Dialog'
import UserEdit from './user/UserEdit'

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

const useStyles = makeStyles({
  paper: {
    padding: '2rem',
    width: '90%',
    maxWidth: '100%',
  },
})

const Tabs = ({blur}: TabProps) => {
  const [currentTab, setCurrentTable] = React.useState<string>('NFTs')
  const [bOpenModal, setOpenModal] = React.useState(false)
  const classes = useStyles()
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

  const updateModal = (name: string):void => {
    setOpenModal(false)
  }

  return (
    <>
      <div className={`w-full mt-20 px-32 ${blur ? 'blur-sm' : ''} mb-20`}>
        <div className="px-12">
          <ul
            className="flex relative justify-item-stretch text-xl font-bold text-center border-b-2 border-[#E9ECEF]">
            <li
              className={`select-none inline-block p-4 rounded-t-[8px] w-40 cursor-pointer z-30 ${currentTab === 'NFTs' ? 'bg-[#E9ECEF] text-[#1E1C21] shadow-[1px_-1px_4px_1px_rgba(233,236,239,1)]' : 'bg-[#F8F9FA] text-[#ADB5BD] shadow-[1px_-1px_4px_1px_rgba(0,0,0,0.1)]'} `}
              onClick={() => setCurrentTable('NFTs')}>
              NFTs
            </li>
            <li className={'select-none inline-block p-4 rounded-t-[8px] w-40 cursor-pointer shadow-[1px_-1px_4px_1px_rgba(0,0,0,0.1)] z-20 bg-[#f3f3f3] text-[#ADB5BD]'}>watchlist</li>
            <li className={'select-none inline-block p-4 rounded-t-[8px] w-40 cursor-pointer shadow-[1px_-1px_4px_1px_rgba(0,0,0,0.1)] z-10 bg-[#f3f3f3] text-[#ADB5BD]'}>feed</li>
            <li className={'select-none inline-block p-4 rounded-t-[8px] w-40 cursor-pointer shadow-[1px_-1px_4px_1px_rgba(0,0,0,0.1)] z-0 bg-[#f3f3f3] text-[#ADB5BD]'}>stats</li>
            <li className={'absolute right-0 select-none inline-block p-4 rounded-t-[8px] w-40 cursor-pointer shadow-[1px_-1px_4px_1px_rgba(0,0,0,0.1)] bg-[#F8F9FA] text-[#6C757D]'} onClick={() => setOpenModal(true) }>settings</li>
          </ul>
          {currentTab === 'NFTs' && <NFTGrid nfts={nfts}/>}
          {currentTab === 'watchlist' && <WatchList/>}
          {/* {currentTab === 'feed' && <Feed feed={feed} />} */}
          {currentTab === 'feed' && <div/>}
          {currentTab === 'stats' && <Stats/>}
        </div>
      </div>
      <Dialog open={bOpenModal} onClose={() => setOpenModal(false)} aria-labelledby='simple-dialog-title' maxWidth={'xl'} classes={{ paper: classes.paper }}>
        <UserEdit updateModal={updateModal} />
      </Dialog>
    </>
  )
}

export default Tabs
