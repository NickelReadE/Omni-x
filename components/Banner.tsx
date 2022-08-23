import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useWallet  from '../hooks/useWallet'
import { useMoralisWeb3Api, useMoralis } from 'react-moralis'
import classNames from '../helpers/classNames'
import Setting from '../public/images/setting.png'
import Twitter from '../public/images/twitter.png'
import Web from '../public/images/web.png'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser ,selectIsGregHolder, selectHeroSkin , updateIsGregHolder} from '../redux/reducers/userReducer'
import UserEdit from './user/UserEdit'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles } from '@material-ui/core/styles'
import Carousel from './carousel'
import {chainsFroSTG, GregContractAddress, veSTGContractAddress, veSTGContractAddresses} from '../constants/addresses'

import Hgreg from '../public/images/gregs/logo.png'
import Stg from '../public/images/stg/stg.png'
import { _fetchData } from 'ethers/lib/utils'

type BannerProps = {
  slides: Array<React.ReactNode>
  blur: boolean
  menu: string
}

const useStyles = makeStyles({
  paper: {
    padding: '2rem',
    width: '90%',
    maxWidth: '100%',
  },
})
const timeout = (delay: number) =>{
  return new Promise( res => setTimeout(res, delay) )
}
const Banner =  ({ slides, blur, menu }: BannerProps): JSX.Element => {
  const disptach = useDispatch()  
  const cuser = useSelector(selectUser)
  const skinName = useSelector(selectHeroSkin)
  const { isInitialized, Moralis } = useMoralis()
  const { address } = useWallet()
  const classes = useStyles()
  const [avatarError, setAvatarError] = useState(false)
  const [bOpenModal, setOpenModal] = React.useState(false)
  const [bShowSettingIcon, setShowSettingIcon] = React.useState(false)
  const [isGregHolder, setIsGregHolder] = useState(false)
  const [isStgStacker, setIsStgStacker] = useState(false)
  const DEFAULT_AVATAR = 'uploads\\default_avatar.png'
  const updateModal = (name: string):void => {
    setOpenModal(false)
  }
  const fetchNFTByAddress = async(chain:'eth'|'bsc'|'polygon'|'avalanche'|'fantom',contractAddress:string) =>{
    timeout(1000)
    const nft= await Moralis.Web3API.account.getNFTsForContract({chain: chain, address:address?address:'',token_address: contractAddress})
    if(nft.total){
      setIsGregHolder(true)
    }
  } 
  const fetchToken =async(chain:'eth' |'bsc'|'polygon'| 'fantom')=>{
    const balances = await Moralis.Web3API.account.getTokenBalances({
      chain: chain, token_addresses: veSTGContractAddress[chain],
      address: address?address:''
    }) 
    if(balances.length>0){
      setIsStgStacker(true)
    }
    console.log('tokens:',balances)   
  }

  useEffect(() => {
    if (isInitialized && address) {
      fetchNFTByAddress('eth',String(GregContractAddress['eth']))
      fetchNFTByAddress('bsc',String(GregContractAddress['bsc']))
      fetchNFTByAddress('polygon',String(GregContractAddress['polygon']))
      fetchNFTByAddress('avalanche',String(GregContractAddress['avalanche'])) 
      fetchNFTByAddress('fantom',String(GregContractAddress['fantom']))
      fetchToken('eth')
      fetchToken('bsc')
      fetchToken('polygon')
      fetchToken('fantom')
    }
  }, [isInitialized, Moralis, address])

  useEffect(()=>{
    disptach(updateIsGregHolder(isGregHolder) as any)
  },[isGregHolder])
  
  return (
    <>
      <div
        className={classNames(
          'w-full',
          'mt-[134px]',
          blur && menu ==='home'? 'blur-sm' : ''
        )}
      >
        <div onMouseEnter={() => setShowSettingIcon(true)} onMouseLeave={() => setShowSettingIcon(false)}>
          <Carousel slides={slides} />
        </div>
        {menu === 'home' && (
          <div className="flex justify-center w-full ">
            <div className="flex justify-between justify-center fw-60 mt-5 relative">
              {/* {
                bShowSettingIcon &&
                <div className="-top-[7rem] left-[1rem] absolute" onMouseEnter={() => setShowSettingIcon(true)} onMouseLeave={() => setShowSettingIcon(false)}>
                  <a className="cursor-pointer" onClick={() => setOpenModal(true)}>
                    <div className="p-2 rounded-full bg-[#adb5bd]/[.5] w-[50px] h-[50px]">
                      <Image src={Setting} alt="avatar"/>
                    </div>
                  </a>
                </div>
              } */}
              <div className="-top-[10rem] left-[5rem] absolute">
                <Image 
                  src={avatarError||cuser.avatar===undefined||cuser.avatar===DEFAULT_AVATAR?'/images/default_avatar.png':(process.env.API_URL + cuser.avatar)} 
                  alt="avatar" 
                  onError={(e)=>{cuser.avatar&&setAvatarError(true)}} 
                  width={200}
                  height={200}
                />
              </div>              
              <div className="flex flex-col ml-[20rem] mt-[10px]">                
                  
                <div className="flex flex-row h-8">
                  <div className="flex items-center text-[26px] text-slate-800 font-semibold mr-[16px]">{cuser.username ? cuser.username : 'username'}</div>
                  {
                    isGregHolder&&<div className='mr-2'><Image src={Hgreg} alt="avatar" width='30px' height='30px' /></div>
                  }
                  {
                  isStgStacker&&<Image src={Stg} alt="avatar" width='30px' height='30px' />
                  }
                </div>                                
               
                <div className="text-[#6C757D] text-[16px] text-slate-800">
                  {cuser.bio?cuser.bio:'You can see the short description about your account'}
                </div>
              </div>
              <div className="flex ml-[]">
                <Link href={cuser.twitter?cuser.twitter:''}>
                  <a>
                    <div className="mr-6">
                      <Image src={Twitter} alt='twitter' />
                    </div>
                  </a>
                </Link>
                <Link href={cuser.website?cuser.website:''}>
                  <a>
                    <div className="mr-6">
                      <Image src={Web} alt='website' />
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>   
      {/* <div className="w-full md:w-auto">
        <Dialog open={bOpenModal} onClose={() => setOpenModal(false)} aria-labelledby='simple-dialog-title' maxWidth={'xl'} classes={{ paper: classes.paper }}>
          <UserEdit updateModal={updateModal} />
        </Dialog>
      </div> */}
    </>
  )
}

export default Banner
