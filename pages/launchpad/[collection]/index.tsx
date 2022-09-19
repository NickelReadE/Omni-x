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


interface chains {
  chainId: string,
  name: string
}

const providerOptions  = {
  walletconnect: {
    package: WalletConnectProvider, 
    options: {
      infuraId: 'https://mainnet.infura.io/v3/12a4aa4f06fe4bc7b5d50d73da475e2a'
    }
  }
}

const networkParams:{[key:string]:object} = {
  '0x1': {
    chainId: '0x1',
    rpcUrls: ['https://api.mycryptoapi.com/eth'],
    chainName: 'ETH',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrls: ['https://etherscan.io']
  },
  '0x38': {
    chainId: '0x38',
    chainName: 'Binance Smart Chain Mainnet',
    nativeCurrency: {
      name: 'BSC',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed1.binance.org'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  '0xa86a': {
    chainId: '0xA86A',
    chainName: 'Avalanche Network',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io/']
  },
  '0x89': {
    chainId: '0x89',
    chainName: 'Matic Mainnet',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com/']
  },
  '0xa4b1': {
    chainId: '0xA4B1',
    chainName: 'Arbitrum Mainnet',
    nativeCurrency: {
      name: 'Arbitrum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io/']
  },
  '0xfa': {
    chainId: '0xFA',
    chainName: 'Fantom Mainnet',
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'MTF',
      decimals: 18
    },
    rpcUrls: ['https://rpc.fantom.network'],
    blockExplorerUrls: ['https://ftmscan.com']
  },
  '0xa': {
    chainId: '0xA',
    chainName: 'Optimistic Ethereum',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.ethereum.io']
  },
}

const addresses:contractInfo = {
  '1': {
    address: '0x7FFE2672C100bFb0094ad0B4d592Dd9f9416f1AC',
    imageSVG: EthereumImageSVG,
    name: 'Ethereum',
    price: 0.06,
    chainId: '101',
    unit: 'ETH',
    color:'#8C8C8C',
    index: 0
  },
  '42161': {
    address: '0x6c25c2c42928Ee8D65D2C3b0a29571BD4549A96B',
    imageSVG: ArbitrumImageSVG,
    name: 'Arbitrum',
    price: 0.06,
    chainId: '110',
    unit: 'ETH',
    color:'#28A0F0',
    index: 500
  },
  '137': {
    address: '0x54417f05c4D5E08B079bd671d0158Ff2854a4a88',
    imageSVG: PolygonImageSVG,
    name: 'Polygon',
    price: 100,
    chainId: '109',
    unit: 'MATIC',
    color:'#8247E5',
    index: 1350
  },
  '43114': {
    address: '0x018BB96D00309236E6D56046BBD8E9e083cC8CE9',
    imageSVG:AvaxImageSVG,
    name: 'Avalanche',
    price: 3.5,
    chainId: '106',
    unit: 'AVAX',
    color:'#E84142',
    index: 2200
  },
  '56': {
    address: '0xc5F4f67442E688Bc4Da2d9D8a055374e642490a4',
    imageSVG:BscscanImageSVG,
    name: 'BNB Chain',
    price: 0.3,
    chainId: '102',
    unit: 'BNB',
    color:'#F3BA2F',
    index: 3050
  },
  '10': {
    address: '0xbb2e4B6e10FE9cCEBFDCa805cdCF9fA9fb65248F',
    imageSVG:OptimisticImageSVG,
    name: 'Optimism',
    price: 0.06,
    chainId: '111',
    unit: 'ETH',
    color:'#FF0320',
    index:3900
  },
  '250': {
    address: '0x165865de32bA3d9552FF814C2F283964c2B61a7D',
    imageSVG: FantomImageSVG,
    name: 'Fantom',
    price: 285,
    chainId: '112',
    unit: 'FTM',
    color:'#13B5EC',
    index: 4200
  }
}
const chainIds: Array<chains> = [
  {
    chainId:'1',
    name:'Ethereum',
  },
  {
    chainId:'42161',
    name:'Arbitrum',
  },
  {
    chainId:'137',
    name:'Polygon',
  },
  {
    chainId:'43114',
    name:'Avalanche',
  },
  {
    chainId:'56',
    name:'BNB Chain',
  },
  {
    chainId:'10',
    name:'Optimism',
  },
  {
    chainId:'250',
    name:'Fantom',
  },
]

const Mint: NextPage = () => {
  const {
    provider,
    signer,
    address,    
    disconnect,
    connect: connectWallet,    
    switchNetwork
  } = useWallet()  
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
      const tokenContract =  new ethers.Contract('0x7FFE2672C100bFb0094ad0B4d592Dd9f9416f1AC', AdvancedONT.abi, signer)
      
      const result =await tokenContract.balanceOf(address)
      const tokenlist = []
      for (let i = 0; i < Number(result); i++) {
        const token = await tokenContract.tokenOfOwnerByIndex(address, i)
        tokenlist.push(Number(token))
      }

      setOwnToken(tokenlist)

      const max_mint = await tokenContract.maxMintId()
      const nextId = await tokenContract.nextMintId()
      console.log(max_mint, nextId)
      setTotalNFTCount(Number(max_mint))
      setNextTokenId(Number(nextId))
      setSubStrateIndex(addresses[`${Number(chainId).toString(10)}`].index)

      const publicmintFlag = await tokenContract._publicSaleStarted()
      const saleFlag = await tokenContract._saleStarted()
      if(!saleFlag && !publicmintFlag){
        setMintable(false)
        errorToast('Sale has not started on '+ addresses[chainId].name)
      } else {
        setMintable(true)
      }
    } catch(error){
      //errorToast('Please check the Internet Connection')
    }
    
  }

  const mint = async ():Promise<void> => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const tokenContract =  new ethers.Contract('0x7FFE2672C100bFb0094ad0B4d592Dd9f9416f1AC', AdvancedONT.abi, signer)
    //first private sale
    //let wladdress = ethereumwl

    // second private sale
    const wladdress = earlysupporter
    const leafNodes = wladdress.map(addr => keccak256(addr))
    const merkleTree = new MerkleTree(leafNodes, keccak256,{sortPairs: true})
    const merkleProof = merkleTree.getHexProof(keccak256(account))
    let mintResult
    setIsMinting(true)
    try {
      const publicmintFlag = true//await tokenContract._publicSaleStarted()
      const saleFlag = true//await tokenContract._saleStarted()
      if(saleFlag && publicmintFlag) {
        const currentBalance = await library.getBalance(account)
        console.log(currentBalance)

        //mintResult = await tokenContract.publicMint(mintNum, {value: ethers.utils.parseEther((addresses[chainId].price*mintNum).toString())})
        const receipt = null //await mintResult.wait()
        if(receipt!=null){
          setIsMinting(false)
          getInfo()
        }
        // add the the function to get the emit from the contract and call the getInfo()
      } else if (saleFlag) {

        const currentBalance = 3//await tokenContract.balanceOf(account)
        if(Number(currentBalance) + mintNum > 5){
          errorToast('You have already minted ' + String(Number(currentBalance)) + ' gregs \n' + 'Can"t mint more than 5 gregs in private sale')
          setIsMinting(false)
        } else{
          //mintResult = await tokenContract.mint(mintNum,merkleProof, {value: ethers.utils.parseEther((addresses[chainId].price*mintNum).toString())})
          // add the the function to get the emit from the contract and call the getInfo()
          const receipt = null//await mintResult.wait()
          if(receipt!=null){
            setIsMinting(false)
            getInfo()
          }
        }
      } 
    } catch (e:any) {
      console.log(e)
      if(e['code'] == 4001){
        errorToast('user denied transaction signature')
      } else {
        const currentBalance = await library.getBalance(account)
        
        if(Number(currentBalance)/Math.pow(10,18)<addresses[chainId].price*mintNum){
          errorToast('There is not enough money to mint nft')
        } else {
          errorToast('your address is not whitelisted on '+ addresses[chainId].name)
        }
      }
      setIsMinting(false)
    }
  }


  const videoSection = () => {
    if(account){
      if(Number(chainId) === 1) {
        return(<>
          <video
            style={{ objectFit: 'cover' }}
            width='100%'
            height='100%'
            autoPlay
            loop
            muted
          >
            <source src='/video/ethereum.mp4' type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </>)
      }  else if(Number(chainId) === 42161) {
        return(<>
          <video
            style={{ objectFit: 'cover' }}
            width='100%'
            height='100%'
            autoPlay
            loop
            muted
          >
            <source src='/video/arbitrum.mp4' type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </>)
      }  else if(Number(chainId) === 137) {
        return(<>
          <video
            style={{ objectFit: 'cover' }}
            width='100%'
            height='100%'
            autoPlay
            loop
            muted
          >
            <source src='/video/polygon.mp4' type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </>)
      }  else if(Number(chainId) === 43114) {
        return(<>
          <video
            style={{ objectFit: 'cover' }}
            width='100%'
            height='100%'
            autoPlay
            loop
            muted
          >
            <source src='/video/avalanche.mp4' type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </>)
      }  else if(Number(chainId) === 56) {
        return(<>
          <video
            style={{ objectFit: 'cover' }}
            width='100%'
            height='100%'
            autoPlay
            loop
            muted
          >
            <source src='/video/binance.mp4' type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </>)
      }  else if(Number(chainId) === 10) {
        return(<>
          <video
            style={{ objectFit: 'cover' }}
            width='100%'
            height='100%'
            autoPlay
            loop
            muted
          >
            <source src='/video/optimistic.mp4' type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </>)
      }  else if(Number(chainId) === 250) {
        return(<>
          <video
            style={{ objectFit: 'cover' }}
            width='100%'
            height='100%'
            autoPlay
            loop
            muted
          >
            <source src='/video/fantom.mp4' type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </>)
      } 
    } else {
      return(<>
        <video
          style={{ objectFit: 'cover' }}
          width='100%'
          height='100%'
          autoPlay
          loop
          muted
        >
          <source src='/video/ethereum.mp4' type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      </>)
    }

  }
  const mintButton = () => {
    if(mintable){
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
  // useEffect(() => {
  //   if (provider?.on) {
  //     const handleAccountsChanged = (accounts:any) => {
  //       setAccount(accounts[0])
  //     }

  //     const handleChainChanged = (chainId:any) => {
  //       if(isContainChains(parseInt(chainId,16))){
  //         setChainId(parseInt(chainId,16))
  //       }else{
  //         errorToast('The current network is not supported, please change the network')
  //         switchNetwork()
  //         setNetwork('1')
  //       }
  //     }

  //     provider.on('accountsChanged', handleAccountsChanged)
  //     provider.on('chainChanged', handleChainChanged)

  //     return () => {
  //       if (provider.removeListener) {
  //         provider.removeListener('accountsChanged', handleAccountsChanged)
  //         provider.removeListener('chainChanged', handleChainChanged)
  //       }
  //     }
  //   }
  // }, [provider])

  useEffect(() => {
    const calculateFee = async():Promise<void> => {
      try{
        if(transferNFT){
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          // const tokenContract =  new ethers.Contract(addresses[`${Number(chainId).toString(10)}`].address, AdvancedONT.abi, signer)
          const adapterParam = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 200000])
          const fee:any =[0.001] //await tokenContract.estimateSendFee(addresses[toChain].chainId, account,transferNFT,false,adapterParam)
          setEstimateFee('Estimate Fee :'+(Number(fee[0])/Math.pow(10,18)*1.1).toFixed(10)+addresses[chainId].unit)
        } else {
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
    if(provider && address){
      getInfo()
    }
  },[provider,address])

  useEffect(()=>{
    dispatch(getCollectionInfo(col_url) as any)
    if(provider && address){
      getInfo()
    }
  },[]) 

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
              <p className='font-bold text-[#A0B3CC] text-xg1 w-[830px]'>{collectionInfo.description? collectionInfo.description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.'}</p>
            </div>
            <div className={mintstyles.mintDataGrid}>
              <div className={mintstyles.mintDataWrap}>
                <h5>minted</h5>
                <span>{nextTokenId - substrateIndex}/{totalNFTCount - substrateIndex}</span>
              </div>
              <span className={mintstyles.line}></span>
              <div className={mintstyles.mintDataWrap}>
                <h5>price</h5>
                {/* <span>{chainId?addresses[`${Number(chainId)}`].price:0}<Image src={chainId?addresses[`${Number(chainId)}`].imageSVG:EthereumImageSVG} width={29.84} height={25.46} alt='ikon'></Image></span> */}
                <div className='flex flex-row space-x-2 items-center mt-[15px]'>
                  <div className='text-xg1 '>
                    {/* {chainId?addresses[`${Number(chainId)}`].price:0} */}
                    0.06
                  </div>
                  <img src='/svgs/ethereum.svg' width={29.84} height={25.46} alt='ikon'></img>
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