import type {NextPage} from 'next'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {ethers} from 'ethers'
import React, {useState, useEffect, useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {getAdvancedInstance, getUSDCInstance} from '../../../utils/contracts'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {Slide} from 'react-toastify'
import {getCollectionInfo, selectCollectionInfo} from '../../../redux/reducers/collectionsReducer'
import MinusSign from '../../../public/images/minus-sign.png'
import PlusSign from '../../../public/images/plus-sign.png'
import mintstyles from '../../../styles/mint.module.scss'
import classNames from '../../../helpers/classNames'
import useWallet from '../../../hooks/useWallet'
import {ChainIds} from '../../../types/enum'
import {formatCurrency, getAddressByName, getChainNameFromId, isGasslessMintable, parseCurrency, SUPPORTED_CHAIN_IDS, validateCurrencyName} from '../../../utils/constants'
import {chainInfos} from '../../../utils/constants'
import { useGaslessMint } from '../../../hooks/useGelato'

const Mint: NextPage = () => {
  const {
    chainId,
    signer,
    provider,
    address
  } = useWallet()
  const router = useRouter()
  const col_url = router.query.collection as string
  const dispatch = useDispatch()
  const collectionInfo = useSelector(selectCollectionInfo)
  const [toChain] = useState<string>('1')
  const [mintNum, setMintNum] = useState<number>(1)
  const [totalNFTCount, setTotalNFTCount] = useState<number>(0)
  const [nextTokenId, setNextTokenId] = useState<number>(0)
  const [transferNFT] = useState<number>(0)
  const [isMinting, setIsMinting] = useState<boolean>(false)
  const [isSwitchingNetwork] = useState<boolean>(false)
  const [price, setPrice] = useState(0)
  const [stablePrice, setStablePrice] = useState(0)
  const [mintType, setMintType] = useState('')
  const [startId, setStartId] = useState(0)
  const [totalCnt, setTotalCnt] = useState(0)
  const [mintedCnt, setMintedCnt] = useState(0)
  const { gaslessMint, waitForRelayTask } = useGaslessMint()

  const decrease = (): void => {
    if (mintNum > 1) {
      setMintNum(mintNum - 1)
    }
  }

  const increase = (): void => {
    if (mintNum < 5) {
      setMintNum(mintNum + 1)
    }
  }
  const errorToast = (error: string): void => {
    toast.error(error, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      transition: Slide
    })
  }

  const getInfo = useCallback(async (): Promise<void> => {
    try {
      if (collectionInfo && signer && chainId) {
        const tokenContract = getAdvancedInstance(collectionInfo.address[chainId], (chainId), signer)
        setStartId(Number(collectionInfo.start_ids[chainId]))

        const priceT = await tokenContract.price()
        setPrice(parseFloat(ethers.utils.formatEther(priceT)))
        const max_mint = await tokenContract.maxMintId()
        const nextId = await tokenContract.nextMintId()
        setTotalNFTCount(Number(max_mint))
        setNextTokenId(Number(nextId))

        const isGasslesMint = isGasslessMintable(col_url, getChainNameFromId(chainId))
        if (isGasslesMint) {
          const stablePrice = await tokenContract.stablePrice()
          setStablePrice(parseFloat(formatCurrency(stablePrice, chainId, 'USDC')))
        }
      }
    } catch (error) {
      console.log(error)
    }
  }, [chainId, collectionInfo, signer])

  const nativeMint = async (): Promise<void> => {
    if (chainId === undefined || !provider || !collectionInfo) {
      return
    }
    const tokenContract = getAdvancedInstance(collectionInfo?.address[chainId], chainId, signer)

    let mintResult
    setIsMinting(true)
    try {
      mintResult = await tokenContract.publicMint(mintNum, {value: ethers.utils.parseEther((price * mintNum).toString())})

      const receipt = await mintResult.wait()

      if (receipt != null) {
        setIsMinting(false)
        await getInfo()
      }

    } catch (e: any) {
      console.log(e)
      if (e['code'] == 4001) {
        errorToast('user denied transaction signature')
      } else {
        const currentBalance = await provider.getBalance(address ? address : '')

        if (Number(currentBalance) / Math.pow(10, 18) < collectionInfo.price * mintNum) {
          errorToast('There is not enough money to mint nft')
        } else {
          errorToast('your address is not whitelisted on ' + provider?._network.name)
        }
      }
      setIsMinting(false)
    }
  }

  const isGasslessMintAvailable = (mintType === 'gasless' && stablePrice != 0)
  const mintButtonName = isGasslessMintAvailable ? 'gasless mint' : 'mint'
  const mintButton = () => {
    // if(mintable){
    const tmp = 1
    if (tmp === 1) {
      if (isMinting) {
        return (
          <button type="button" disabled>
            <i className="fa fa-spinner fa-spin font-bold text-xl"
              style={{'letterSpacing': 'normal'}}
            />
            {mintButtonName}
          </button>
        )
      } else {
        if (isSwitchingNetwork) {
          return (
            <button type="button" disabled>{mintButtonName}</button>
          )
        } else {
          return (
            <>
              <button type="button" onClick={() => mint()}>{mintButtonName}</button>
            </>
            
          )
        }
      }
    } else {
      return (
        <button type="button" disabled>{mintButtonName}</button>
      )
    }
  }

  const switchMintType = (type: string) => {
    if (type === 'gasless' && stablePrice != 0) {
      setMintType(type)
    }
  }

  const stableMint = async (): Promise<void> => {
    if (chainId === undefined || !provider || !collectionInfo || !address) {
      return
    }
    const collectionAddr = collectionInfo?.address[chainId]
    const newCurrencyName = validateCurrencyName('USDC', chainId) || 'USDC'
    const tokenContract = getAdvancedInstance(collectionAddr, chainId, signer)
    const usdContract = getUSDCInstance(getAddressByName(newCurrencyName, chainId), chainId, signer)

    setIsMinting(true)
    try {

      const price = await tokenContract.stablePrice()
      const allowance = await usdContract?.allowance(address, tokenContract.address)
      if (allowance.lt(price)) {
        await (await usdContract?.approve(tokenContract.address, price)).wait()
      }
      const response = await gaslessMint(tokenContract, chainId, mintNum, address)
      await waitForRelayTask(response)

      setIsMinting(false)
      await getInfo()

    } catch (e: any) {
      console.log(e)
      setIsMinting(false)
    }
  }

  const mint = () => {
    if (isGasslessMintAvailable) {
      return stableMint()
    }
    else {
      return nativeMint()
    }
  }

  useEffect(() => {
    const calculateFee = async (): Promise<void> => {
      try {
        if (transferNFT) {
          //const provider = new ethers.providers.Web3Provider(window.ethereum)
          //const signer = provider.getSigner()
          // const tokenContract =  new ethers.Contract(addresses[`${Number(chainId).toString(10)}`].address, AdvancedONT.abi, signer)
          //const adapterParam = ethers.utils.solidityPack(['uint16', 'uint256'], [1, 200000])
          //const fee:any =[0.001] //await tokenContract.estimateSendFee(addresses[toChain].chainId, account,transferNFT,false,adapterParam)
          // setEstimateFee('Estimate Fee :'+(Number(fee[0])/Math.pow(10,18)*1.1).toFixed(10)+addresses[chainId].unit)
        } else {
          //setEstimateFee('')
        }
      } catch (error) {
        console.log(error)
        if (String(chainId) == toChain) {
          //errorToast(`${addresses[toChain].name} is currently unavailable for transfer`)
        } else {
          //errorToast('Please Check the Internet Connection!!!')
        }

      }
    }
    calculateFee()
  }, [toChain, transferNFT, chainId])

  useEffect(() => {
    (async () => {
      if (chainId && signer && collectionInfo) {
        await getInfo()
      }
    })()
  }, [signer, collectionInfo, chainId, getInfo])
  useEffect(() => {
    dispatch(getCollectionInfo(col_url) as any)
  }, [col_url, dispatch])
  useEffect(() => {
    if (Number(nextTokenId) >= 0 && startId >= 0) {
      setMintedCnt(Number(nextTokenId) - startId)
    }
  }, [nextTokenId, startId])
  useEffect(() => {
    if (Number(totalNFTCount) >= 0 && startId >= 0) {
      setTotalCnt(Number(totalNFTCount) - startId)
    }
  }, [totalNFTCount, startId])


  return (
    <>
      <ToastContainer/>
      <div className={classNames(mintstyles.mintHero, 'font-RetniSans')}>
        <div className={classNames(mintstyles.container, 'flex justify-between px-[150px]')}>
          <div className={mintstyles.mintImgWrap}>
            <div className={mintstyles.mintImgT}>
              <img className="w-[600px] rounded-md "
                src={collectionInfo && collectionInfo.profile_image ? collectionInfo.profile_image : '/images/nft.png'}
                alt="nft-image"/>
            </div>
          </div>
          <div>
            <h1 className="font-bold text-xxl2">{collectionInfo && collectionInfo.name ? collectionInfo.name : 'Collection Name'}</h1>
            <div className={mintstyles.mintDescSec}>
              <p
                className="font-bold text-[#A0B3CC] text-xg1 w-[830px]">{collectionInfo && collectionInfo.description ? collectionInfo.description : 'Description here'}</p>
            </div>
            <div className={mintstyles.mintDataGrid}>
              <div className={mintstyles.mintDataWrap}>
                <h5>minted</h5>
                <span>{mintedCnt > 0 ? mintedCnt : 0}/{totalCnt > 0 ? totalCnt : 0}</span>
              </div>
              <span className={mintstyles.line}></span>
              <div className={mintstyles.mintDataWrap}>
                <h5>price</h5>
                {/* <span>{chainId?addresses[`${Number(chainId)}`].price:0}<Image src={chainId?addresses[`${Number(chainId)}`].imageSVG:EthereumImageSVG} width={29.84} height={25.46} alt='ikon'></Image></span> */}
                <div className="flex flex-row space-x-2 items-center mt-[15px]">
                  <div className="text-xg1 ">
                    {(price * mintNum).toFixed(2)}
                  </div>
                  {
                    chainId && !isGasslessMintAvailable &&
                    SUPPORTED_CHAIN_IDS.map((networkId: ChainIds, index) => {
                      return chainId === networkId && <img
                        onClick={() => switchMintType('gasless')}
                        key={index}
                        alt={'networkIcon'}
                        src={chainInfos[networkId].logo || chainInfos[ChainIds.ETHEREUM].logo}
                        className="m-auto h-[45px]"/>
                    })
                  }
                  {
                    chainId && isGasslessMintAvailable && (
                      <img 
                        onClick={() => switchMintType('')}
                        alt={'networkIcon'}
                        src={'images/payment/usdc.png'}
                        className="m-auto h-[45px]"/>
                    )
                  }
                </div>
              </div>
              <span className={mintstyles.line}></span>
              <div className={mintstyles.mintDataWrap}>
                <h5>quantity</h5>
                <div className={mintstyles.counterWrap}>
                  <button onClick={() => decrease()}><Image src={MinusSign} alt="minus"></Image></button>
                  <span>{mintNum}</span>
                  <button onClick={() => increase()}><Image src={PlusSign} alt="plus"></Image></button>
                </div>
              </div>
            </div>
            <div
              className="w-fit px-2 py-1 text-white border-2 border-[#B444F9] bg-[#B444F9] rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:drop-shadow-[0_10px_10px_rgba(180,68,249,0.7)] active:scale-100 active:drop-shadow-[0_5px_5px_rgba(180,68,249,0.8)]">
              {mintButton()}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Mint
