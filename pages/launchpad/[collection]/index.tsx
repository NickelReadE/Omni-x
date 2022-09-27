import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import MintImgBottom from '../../../public/images/mintImg-bg.png'
import EthereumImageSVG from '../../../public/svgs/ethereum.svg'
import BscscanImageSVG from '../../../public/svgs/binance.svg'
import AvaxImageSVG from '../../../public/svgs/avax.svg'
import PolygonImageSVG from '../../../public/svgs/polygon.svg'
import ArbitrumImageSVG from '../../../public/svgs/arbitrum.svg'
import FantomImageSVG from '../../../public/svgs/fantom.svg'
import OptimisticImageSVG from '../../../public/svgs/optimism.svg'
import MinusSign from '../../../public/images/minus-sign.png'
import PlusSign from '../../../public/images/plus-sign.png'
import mintstyles from '../../../styles/mint.module.scss'
import WalletConnectProvider  from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import React, { useState , useEffect } from 'react'
import { getCollectionInfo, selectCollectionInfo } from '../../../redux/reducers/collectionsReducer'
import { useDispatch, useSelector } from 'react-redux'
import AdvancedONT from '../../../constants/abis/AdvancedONT.json'
import ethereumwl from '../../../constants/whitelist/ethereum.json'
import earlysupporter from '../../../constants/whitelist/earlysupporter.json'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Slide } from 'react-toastify'
import { contractInfo } from '../../../interface/interface'
import classNames from '../../../helpers/classNames'
import useWallet from '../../../hooks/useWallet'



//video 
import { MerkleTree } from 'merkletreejs'
import keccak256  from 'keccak256'
import { cornersOfRectangle } from '@dnd-kit/core/dist/utilities/algorithms/helpers'

const Mint: NextPage = () => {
  const {
    provider,
    signer,
    address,    
    disconnect,
    connect: connectWallet,    
    switchNetwork
  } = useWallet()
  const env = process.env.NEXT_PUBLICE_ENVIRONMENT || 'testnet'
  const router = useRouter()
  const col_url = router.query.collection as string 
  const dispatch = useDispatch()
  const collectionInfo = useSelector(selectCollectionInfo)   
  const [library, setLibrary] = useState<any>()
  const [account, setAccount] = useState<any>()
  const [network, setNetwork] = useState<string>('1')
  const [chainId, setChainId] = useState<any>()
  const [toChain, setToChain] = useState<string>('1')
  const [mintNum, setMintNum] = useState<number>(1)
  const [ownToken, setOwnToken] = useState<Array<number>>([])
  const [totalNFTCount, setTotalNFTCount] = useState<number>(0)
  const [nextTokenId, setNextTokenId] = useState<number>(0)
  const [substrateIndex, setSubStrateIndex] = useState<number>(0)
  const [transferNFT, setTransferNFT] = useState<number>(0)
  const [init, setInitial] = useState<boolean>(false)
  const [isMinting,setIsMinting] = useState<boolean>(false)
  const [estimateFee, setEstimateFee] = useState<string>('')
  const [mintable, setMintable] = useState<boolean>(false)
  const [isTransferring,setIsTransferring] = useState<boolean>(false)
  const [isSwitchingNetwork,setIsSwitchingNetwork] = useState<boolean>(false)
  const [price, setPrice] = useState(0)
  const [startId, setStartId] = useState(0)
  const [totalCnt, setTotalCnt] = useState(0)
  const [mintedCnt, setMintedCnt] = useState(0)
  const decrease = ():void => {
    if(mintNum > 1) {
      setMintNum(mintNum - 1)
    }
  }

  const increase = ():void => {
    if(mintNum < 5) {
      setMintNum(mintNum + 1)
    }
  }
  const errorToast = (error:string):void =>{
    toast.error(error,{
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      transition: Slide
    })
  }

  const getInfo = async ():Promise<void> => {
    
    try{    
      
      const tokenContract =  new ethers.Contract(collectionInfo.address[chainId?chainId:0], AdvancedONT, signer)
      setStartId(Number(collectionInfo.start_ids[chainId?chainId:0]))      
      const result =await tokenContract.balanceOf(address)
      const tokenlist = []
      for (let i = 0; i < Number(result); i++) {
        const token = await tokenContract.tokenOfOwnerByIndex(address, i)
        tokenlist.push(Number(token))
      }

      setOwnToken(tokenlist)

      const priceT = await tokenContract.price()
      setPrice(parseFloat(ethers.utils.formatEther(priceT)))
      const max_mint = await tokenContract.maxMintId()
      const nextId = await tokenContract.nextMintId()
      setTotalNFTCount(Number(max_mint))
      setNextTokenId(Number(nextId))
      setSubStrateIndex(10)

      const publicmintFlag = await tokenContract._publicSaleStarted()
      const saleFlag = await tokenContract._saleStarted()
      if(!saleFlag && !publicmintFlag){
        setMintable(false)
        //errorToast('Sale has not started on '+ provider?._network.name)
      } else {
        setMintable(true)
      }
    } catch(error){
      console.log(error)
    }
    
  }

  // const mint = async ():Promise<void> => {
  //   console.log("STarted to mint")
  //   const provider = new ethers.providers.Web3Provider(window.ethereum)
  //   const signer = provider.getSigner()
  //   const tokenContract =  new ethers.Contract(collectionInfo.address[chainId?chainId:0], AdvancedONT, signer)
  //   //first private sale
  //   //let wladdress = ethereumwl

  //   // second private sale
  //   const wladdress = earlysupporter
  //   const leafNodes = wladdress.map(addr => keccak256(addr))
  //   const merkleTree = new MerkleTree(leafNodes, keccak256,{sortPairs: true})
  //   const merkleProof = merkleTree.getHexProof(keccak256(account))
  //   let mintResult
  //   setIsMinting(true)
  //   try {
  //     const publicmintFlag = await tokenContract._publicSaleStarted()
  //     const saleFlag = await tokenContract._saleStarted()
  //     if(saleFlag && publicmintFlag) {
  //       const currentBalance = await library.getBalance(account)

  //       mintResult = await tokenContract.publicMint(mintNum, {value: ethers.utils.parseEther((collectionInfo.price*mintNum).toString())})
  //       const receipt = await mintResult.wait()
  //       if(receipt!=null){
  //         setIsMinting(false)
  //         getInfo()
  //       }
  //       // add the the function to get the emit from the contract and call the getInfo()
  //     } else if (saleFlag) {

  //       const currentBalance = await tokenContract.balanceOf(account)
  //       if(Number(currentBalance) + mintNum > 5){
  //         errorToast('You have already minted ' + String(Number(currentBalance)) + ' gregs \n' + 'Can"t mint more than 5 gregs in private sale')
  //         setIsMinting(false)
  //       } else{
  //         mintResult = await tokenContract.mint(mintNum,merkleProof, {value: ethers.utils.parseEther((collectionInfo.price*mintNum).toString())})
  //         // add the the function to get the emit from the contract and call the getInfo()
  //         const receipt = await mintResult.wait()
  //         if(receipt!=null){
  //           setIsMinting(false)
  //           getInfo()
  //         }
  //       }
  //     } 
  //   } catch (e:any) {
  //     console.log(e)
  //     if(e['code'] == 4001){
  //       errorToast('user denied transaction signature')
  //     } else {
  //       const currentBalance = await library.getBalance(account)
        
  //       if(Number(currentBalance)/Math.pow(10,18)<collectionInfo.price*mintNum){
  //         errorToast('There is not enough money to mint nft')
  //       } else {
  //         errorToast('your address is not whitelisted on '+ provider?._network.name)
  //       }
  //     }
  //     setIsMinting(false)
  //   }
  // }
  const mint = async ():Promise<void> => {
    if(chainId===undefined){
      return
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const tokenContract =  new ethers.Contract(collectionInfo?.address[chainId], AdvancedONT, signer)
    //first private sale
    //let wladdress = ethereumwl

    // second private sale
    
    const wladdress = earlysupporter
    const leafNodes = wladdress.map(addr => keccak256(addr))
    const merkleTree = new MerkleTree(leafNodes, keccak256,{sortPairs: true})
    const merkleProof = merkleTree.getHexProof(keccak256(account))
    const library = await provider.getBalance(address?address:'')
    let mintResult
    setIsMinting(true)
    try {
      const publicmintFlag = await tokenContract._publicSaleStarted()
      const saleFlag = await tokenContract._saleStarted()      
      const currentBalance = await provider.getBalance(address?address:'')

      mintResult = await tokenContract.publicMint(mintNum, {value: ethers.utils.parseEther((price*mintNum).toString())})
      
      const receipt = await mintResult.wait()
      if(receipt!=null){
        setIsMinting(false)
        getInfo()
      }      
       
    } catch (e:any) {
      console.log(e)
      if(e['code'] == 4001){
        errorToast('user denied transaction signature')
      } else {
        const currentBalance = await provider.getBalance(address?address:'')
        
        if(Number(currentBalance)/Math.pow(10,18)<collectionInfo.price*mintNum){
          errorToast('There is not enough money to mint nft')
        } else {
          errorToast('your address is not whitelisted on '+ provider?._network.name)
        }
      }
      setIsMinting(false)
    }
  }
  const mintButton = () => {
    // if(mintable){
    const tmp=1
    if(tmp===1){
      if(isMinting){
        return(
          <button type='button'  disabled><i  className='fa fa-spinner fa-spin font-bold text-xl  ' style={{'letterSpacing':'normal'}}/>mint now</button>
        )
      } else {
        if(isSwitchingNetwork){
          return(
            <button type='button' disabled>mint now</button>
          )
        } else {
          return(
            <button type='button' onClick={()=>mint()}>mint now</button>
          )
        }
      }
    } else{
      return(
        <button type='button'  disabled>mint now</button>
      )
    }
  }
  if(window.ethereum){
    window.ethereum.on('chainChanged', function (networkId:string) {      
      setChainId(parseInt(networkId))
    }) 
  }
  useEffect(() => {
    const calculateFee = async():Promise<void> => {
      try{
        if(transferNFT){
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          // const tokenContract =  new ethers.Contract(addresses[`${Number(chainId).toString(10)}`].address, AdvancedONT.abi, signer)
          const adapterParam = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 200000])
          const fee:any =[0.001] //await tokenContract.estimateSendFee(addresses[toChain].chainId, account,transferNFT,false,adapterParam)
          // setEstimateFee('Estimate Fee :'+(Number(fee[0])/Math.pow(10,18)*1.1).toFixed(10)+addresses[chainId].unit)
        }else{
          setEstimateFee('')
        }
      } catch(error){
        console.log(error)
        if(String(chainId) == toChain){
          //errorToast(`${addresses[toChain].name} is currently unavailable for transfer`)
        } else {
          //errorToast('Please Check the Internet Connection!!!')
        }

      }
    }
    calculateFee()
  },[toChain,transferNFT])


  useEffect(()=>{
    if(chainId && provider && address && collectionInfo){
      getInfo()
    }
  },[provider,address,collectionInfo,chainId])
  useEffect(()=>{
    if(provider?._network){
      setChainId(provider._network.chainId)
    }
  },[provider?._network])
  useEffect(()=>{
    dispatch(getCollectionInfo(col_url) as any)  
  },[]) 
  useEffect(()=>{
    if(Number(nextTokenId)>=0 && startId >=0){
      setMintedCnt(Number(nextTokenId) - startId)
    }
  },[nextTokenId, startId])
  useEffect(()=>{
    if(Number(totalNFTCount)>=0 && startId >=0){
      setTotalCnt(Number(totalNFTCount) - startId)
    }
  },[totalNFTCount, startId])
  return (
    <>      
      <ToastContainer />
      <div className={classNames(mintstyles.mintHero, 'font-RetniSans')}>         
        <div className={classNames(mintstyles.container, 'flex justify-between px-[150px]')}>
          <div className={mintstyles.mintImgWrap}>
            <div className={mintstyles.mintImgT}>
              <img className='w-[600px] rounded-md ' src={collectionInfo.profile_image?collectionInfo.profile_image:'/images/nft.png'} alt="nft-image" />
            </div>
          </div>
          <div >
            <h1 className='font-bold text-xxl2'>{collectionInfo.name?collectionInfo.name:'Collection Name'}</h1>
            <div className={mintstyles.mintDescSec}>
              <p className='font-bold text-[#A0B3CC] text-xg1 w-[830px]'>{collectionInfo.description? collectionInfo.description: 'Descriptoin here'}</p>
            </div>
            <div className={mintstyles.mintDataGrid}>
              <div className={mintstyles.mintDataWrap}>
                <h5>minted</h5>
                <span>{mintedCnt>0?mintedCnt:0}/{totalCnt>0?totalCnt:0}</span>
              </div>
              <span className={mintstyles.line}></span>
              <div className={mintstyles.mintDataWrap}>
                <h5>price</h5>
                {/* <span>{chainId?addresses[`${Number(chainId)}`].price:0}<Image src={chainId?addresses[`${Number(chainId)}`].imageSVG:EthereumImageSVG} width={29.84} height={25.46} alt='ikon'></Image></span> */}
                <div className='flex flex-row space-x-2 items-center mt-[15px]'>
                  <div className='text-xg1 '>
                    {(price*mintNum).toFixed(2)}                    
                  </div>
                  {
                    chainId === (env === 'testnet' ? 4 : 1) && <img src="/sidebar/ethereum.png" className="m-auto h-[35px]" />
                  }
                  {
                    chainId === (env === 'testnet' ? 421611 : 1) && <img src="/sidebar/arbitrum.png" className="m-auto h-[35px]" />
                  }
                  {
                    chainId === (env === 'testnet' ? 43113 : 1) && <img src="/sidebar/avax.png" className="m-auto h-[35px]" />
                  }
                  {
                    chainId === (env === 'testnet' ? 97 : 1) && <img src="/sidebar/binance.png" className="m-auto h-[35px]" />
                  }
                  {
                    chainId === (env === 'testnet' ? 4002 : 1) && <img src="/sidebar/fantom.png" className="m-auto h-[35px]" />
                  }
                  {
                    chainId === (env === 'testnet' ? 69 : 1) && <img src="/sidebar/optimism.png" className="m-auto h-[35px]" />
                  }
                  {
                    chainId === 80001 && <img src="/sidebar/polygon.png" className="m-auto h-[35px]" />
                  }
                </div>
              </div>
              <span className={mintstyles.line}></span>
              <div className={mintstyles.mintDataWrap}>
                <h5>quantity</h5>
                <div className={mintstyles.counterWrap}>
                  <button onClick={()=>decrease()}><Image src={MinusSign} alt='minus'></Image></button>
                  <span>{mintNum}</span>
                  <button onClick={()=>increase()}><Image src={PlusSign} alt='plus'></Image></button>
                </div>
              </div>
            </div>
            <div className='w-fit	 px-2 py-1 text-white border-2 border-[#B444F9] bg-[#B444F9] rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:drop-shadow-[0_10px_10px_rgba(180,68,249,0.7)] active:scale-100 active:drop-shadow-[0_5px_5px_rgba(180,68,249,0.8)]'>
              {mintButton()}
            </div>
          </div>
        </div>
      </div>    
    </>
  )
}

export default Mint