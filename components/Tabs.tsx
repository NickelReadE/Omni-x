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
// import { selectSearchText } from '../redux/reducers/headerReducer'
// import { getNFTInfo } from '../redux/reducers/collectionsReducer'

import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import UserEdit from './user/UserEdit'

type TabProps = {
  blur: boolean,
}

const useStyles = makeStyles({
  paper: {
    padding: '0rem 2rem 0rem 0rem',
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
  // const searchText = useSelector(selectSearchText)

  const updateModal = (name: string):void => {
    setOpenModal(false)
  }

  // useEffect(()=>{
  //   if(searchText!='') {
  //     const col_url = searchText.split('#')[0]
  //     const token_id = searchText.split('#')[1]
  //     if(col_url!=undefined&&token_id!=''){
  //       dispatch(getNFTInfo(col_url, token_id) as any)
  //     }
  //   }
  // },[searchText])

  return (
    <div className="flex justify-center">
      <div className={`flex justify-center mt-36 w-[90%] ${blur ? 'blur-sm' : ''} mb-20`}>
        <div className="w-[90%]">
          <ul
            className="flex relative justify-item-stretch text-[16px] font-medium text-center border-b-2 border-[#E9ECEF]">
            <li
              className={`select-none inline-block p-4 border-b-2 border-black w-36 cursor-pointer z-30 ${currentTab === 'NFTs' ? 'text-[#1E1C21] ' : ' text-[#ADB5BD] '} `}
              onClick={() => setCurrentTable('NFTs')}>
              NFTs
            </li>
            <li className={'select-none inline-block p-4  w-36 cursor-pointer  z-0  text-[#ADB5BD]'}>watchlist</li>
            <li className={'select-none inline-block p-4  w-36 cursor-pointer  z-0  text-[#ADB5BD]'}>feed</li>
            <li className={'select-none inline-block p-4  w-36 cursor-pointer  z-0  text-[#ADB5BD]'}>stats</li>
            <li className={'absolute right-0 select-none inline-block p-4  w-36 cursor-pointer   text-[#6C757D]'} onClick={() => setOpenModal(true) }>settings</li>
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
    </div>
  )
}

export default Tabs
