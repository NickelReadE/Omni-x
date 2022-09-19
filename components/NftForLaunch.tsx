import React,{useEffect} from 'react'
import { ITypeNFT } from '../interface/interface'
import Link from 'next/link'
import { getCollectionInfo, selectCollectionInfo } from '../redux/reducers/collectionsReducer'
import { useDispatch, useSelector } from 'react-redux'
const NftForLaunch = (pro:ITypeNFT) => {
  const dispatch = useDispatch()
  const collectionInfo = useSelector(selectCollectionInfo)
  useEffect(()=>{
    dispatch(getCollectionInfo(pro.col_url) as any)
  },[])
  const typeNFT = pro.typeNFT
  console.log('TypeNFT',collectionInfo)
  return (
    <Link href={`/launchpad/${pro.col_url}`}>
      <div className=' border-[#F8F9FA]  rounded-[8px] hover:cursor-pointer'>
        <p className='font-bold text-xl2 mb-[24px]'>
          {typeNFT==='Live'?'Live Launches':'Upcoming'}
          
        </p>
        <div className='flex flex-col bg-l-50 '>
          <div className="group relative flex justify-center text-center overflow-hidden rounded-md" >
            <img className='w-[300px] rounded-md ' src={collectionInfo.profile_image?collectionInfo.profile_image:'/images/nft.png'} alt="nft-image" />        
          </div>
          <div className="flex flex-row justify-between  px-3 mt-[12px] align-middle  font-['RetniSans']">
            <div className=" text-[#000000] text-[14px] font-bold">
              {collectionInfo.name?.toUpperCase()}
            </div>
          </div>
          <div className='flex px-3 justify-between'>    
            <div className='flex space-x-6'>
              <div className="flex flex-col mt-2.5 mb-3.5 justify-between align-middle text-[#A0B3CC]">
                <div className="flex items-center">
                items
                </div>
                <div className="flex items-center ">
                  {pro.items}
                </div>
              </div>
              <div className="flex flex-col mt-2.5 mb-3.5 justify-between align-middle text-[#A0B3CC]">
                <div className="flex items-center ">
                  price
                </div>
                <div className="flex items-center">
                  0.1Eth
                </div>
              </div>
            </div>    
            <div className="flex flex-col mt-2.5 mb-3.5 justify-between align-middle text-[#A0B3CC]">
              <div className="flex items-center ">
                {typeNFT==='Live'?'time remaining':'date'}
              </div>
              <div className="flex items-center  text-[#B00000] ">
                {typeNFT==='Live'?'23hrs 10min':'5 Sep'}
                
              </div>
            </div>
          </div>
        </div>
        
        
        
      </div>    
    </Link>
   
  )
}

export default NftForLaunch
