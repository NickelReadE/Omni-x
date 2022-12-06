/* eslint-disable @typescript-eslint/no-unused-vars */
import type {NextPage} from 'next'
import {useRouter} from 'next/router'
import {ethers} from 'ethers'
import React, {useState, useEffect, useCallback} from 'react'
import {getAdvancedInstance} from '../../../utils/contracts'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {Slide} from 'react-toastify'
import classNames from '../../../helpers/classNames'
import useWallet from '../../../hooks/useWallet'
import {ChainIds} from '../../../types/enum'
import {chainInfos} from '../../../utils/constants'
import useCollection from '../../../hooks/useCollection'
import {ExternalLink} from '../../../components/basic'
import WebsiteIcon from '../../../public/images/icons/website.svg'
import TwitterIcon from '../../../public/images/icons/twitter.svg'
import TelegramIcon from '../../../public/images/icons/telegram.svg'
import DiscordIcon from '../../../public/images/icons/discord.svg'
import {PrimaryButton} from '../../../components/common/buttons/PrimaryButton'

const Mint: NextPage = () => {
  const {
    chainId,
    signer,
    provider,
    address
  } = useWallet()
  const router = useRouter()
  const col_url = router.query.collection as string
  const [mintNum, setMintNum] = useState<number>(1)
  const [totalNFTCount, setTotalNFTCount] = useState<number>(0)
  const [nextTokenId, setNextTokenId] = useState<number>(0)
  const [isMinting, setIsMinting] = useState<boolean>(false)
  const [price, setPrice] = useState(0)
  const [startId, setStartId] = useState(0)
  const [totalCnt, setTotalCnt] = useState(0)
  const [mintedCnt, setMintedCnt] = useState(0)
  const [selectedTab, setSelectedTab] = useState(0)

  const { collectionInfo } = useCollection(col_url)
  
  const activeClasses = (index: number) => {
    return index === selectedTab ? 'bg-primary-gradient': 'bg-secondary'
  }
  const activeTextClasses = (index: number) => {
    return index === selectedTab ? 'bg-primary-gradient bg-clip-text text-transparent': 'text-secondary'
  }
  
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
      if (collectionInfo && signer) {
        const tokenContract = getAdvancedInstance(collectionInfo.address[chainId ? chainId : 0], (chainId ? chainId : ChainIds.ETHEREUM), signer)
        setStartId(Number(collectionInfo.start_ids[chainId ? chainId : 0]))

        const priceT = await tokenContract.price()
        setPrice(parseFloat(ethers.utils.formatEther(priceT)))
        const max_mint = await tokenContract.maxMintId()
        const nextId = await tokenContract.nextMintId()
        setTotalNFTCount(Number(max_mint))
        setNextTokenId(Number(nextId))
      }
    } catch (error) {
      console.log(error)
    }
  }, [chainId, collectionInfo, signer])

  const mint = async (): Promise<void> => {
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

  useEffect(() => {
    (async () => {
      if (chainId && signer && collectionInfo) {
        await getInfo()
      }
    })()
  }, [signer, collectionInfo, chainId, getInfo])

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
      <div className={'pt-8 px-8 lg:px-[150px]'}>
        <div className={classNames('flex justify-between')}>
          <div className={'flex flex-1 justify-center mr-2'}>
            <div className={'max-w-[600px]'}>
              <img className="w-[600px] rounded-md" src={collectionInfo && collectionInfo.profile_image ? collectionInfo.profile_image : '/images/nft.png'}
                alt="nft-image"/>

              <div className="mt-10">
                <div className="text-xl font-medium text-center text-secondary">
                  <ul className="flex flex-wrap -mb-px">
                    <li onClick={() => setSelectedTab(0)}>
                      <div className={`${activeClasses(0)} pb-[2px] cursor-pointer`}>
                        <div className={'flex flex-col justify-between h-full bg-primary text-white p-4 pb-1'}>
                          <span className={`${activeTextClasses(0)}`}>about</span>
                        </div>
                      </div>
                    </li>
                    <li onClick={() => setSelectedTab(1)}>
                      <div className={`${activeClasses(1)} pb-[2px] cursor-pointer`}>
                        <div className={'flex flex-col justify-between h-full bg-primary text-white p-4 pb-1'}>
                          <span className={`${activeTextClasses(1)}`}>utility</span>
                        </div>
                      </div>
                    </li>
                    <li onClick={() => setSelectedTab(2)}>
                      <div className={`${activeClasses(2)} pb-[2px] cursor-pointer`}>
                        <div className={'flex flex-col justify-between h-full bg-primary text-white p-4 pb-1'}>
                          <span className={`${activeTextClasses(2)}`}>team</span>
                        </div>
                      </div>
                    </li>
                    <li onClick={() => setSelectedTab(4)}>
                      <div className={`${activeClasses(4)} pb-[2px] cursor-pointer`}>
                        <div className={'flex flex-col justify-between h-full bg-primary text-white p-4 pb-1'}>
                          <span className={`${activeTextClasses(4)}`}>roadmap</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="py-4">
                  {
                    selectedTab === 0 &&
                      <div className="text-primary-light text-[16px] leading-[19px]">{collectionInfo && collectionInfo.description ? collectionInfo.description : 'Description here'}</div>
                  }
                  {
                    selectedTab === 1 &&
                      <div className={''}>
                      </div>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className={'flex flex-1'}>
            <div>
              <span className="font-medium text-primary-light text-xxl">
                {collectionInfo && collectionInfo.name ? collectionInfo.name : 'Collection Name'}
              </span>

              {/*Icon group*/}
              <div className={'flex items-center mt-4'}>
                <div className={'w-8 h-8 p-1'}>
                  <ExternalLink link={collectionInfo?.website}>
                    <WebsiteIcon />
                  </ExternalLink>
                </div>
                <div className={'w-8 h-8 p-1'}>
                  <ExternalLink link={collectionInfo?.twitter}>
                    <TwitterIcon />
                  </ExternalLink>
                </div>
                <div className={'w-8 h-8 p-1'}>
                  <ExternalLink link={collectionInfo?.discord}>
                    <DiscordIcon />
                  </ExternalLink>
                </div>
                <div className={'w-8 h-8 p-1'}>
                  <ExternalLink link={collectionInfo?.telegram}>
                    <TelegramIcon />
                  </ExternalLink>
                </div>
              </div>

              {/*creator*/}
              <div className={'flex flex-col mt-4'}>
                <div className={'text-secondary text-lg'}>creator</div>
                <div className={'text-primary-light text-lg mt-2'}>@{collectionInfo?.col_url.toLowerCase()}</div>
              </div>

              {/*items*/}
              <div className={'flex mt-4'}>
                <div className={'text-secondary text-lg'}>items</div>
                <div className={'text-primary-light text-lg ml-2 text-shadow-sm2'}>{totalCnt}</div>
              </div>

              {/*whitelist 1*/}
              <div className={'flex flex-col mt-4'}>
                <div className={'rounded-[8px] p-[1px] bg-primary-gradient w-[350px]'}>
                  <div className={'flex flex-col py-2 px-3 rounded-[8px] bg-primary'}>
                    <div className={'flex justify-between'}>
                      <div className={'text-secondary text-xl text-shadow-sm2'}>whitelist 1</div>
                      <div className={'text-xl text-shadow-sm2 bg-clip-text text-transparent bg-primary-gradient font-medium'}>live
                      </div>
                    </div>
                    <div className={'flex justify-between mt-2'}>
                      <div className={'flex items-center'}>
                        <span className={'text-secondary text-xxxl text-shadow-sm2 mr-4'}>
                          {(price * mintNum).toFixed(2)}
                        </span>
                        {
                          chainId &&
                            <img 
                              alt={'networkIcon'}
                              src={chainInfos[chainId].logo || chainInfos[ChainIds.ETHEREUM].logo}
                              className="'w-8 h-8"
                            />
                        }
                      </div>
                      <PrimaryButton text={'mint'} className={'px-6'} onClick={() => mint()} />
                    </div>
                    <div className={'mt-2 text-primary-light font-medium text-[14px] leading-[18px] text-shadow-sm2'}>
                      2,000 max - 1 per wallet
                    </div>
                  </div>
                </div>
              </div>
              {/*<div className={mintstyles.mintDataGrid}>
                <div className={mintstyles.mintDataWrap}>
                  <h5>minted</h5>
                  <span>{mintedCnt > 0 ? mintedCnt : 0}/{totalCnt > 0 ? totalCnt : 0}</span>
                </div>
                <span className={mintstyles.line}></span>
                <div className={mintstyles.mintDataWrap}>
                  <h5>price</h5>
                  <div className="flex flex-row space-x-2 items-center mt-[15px]">
                    <div className="text-xg1 ">
                      {(price * mintNum).toFixed(2)}
                    </div>
                    {
                      chainId &&
                      SUPPORTED_CHAIN_IDS.map((networkId: ChainIds, index) => {
                        return chainId === networkId && <img key={index} alt={'networkIcon'}
                          src={chainInfos[networkId].logo || chainInfos[ChainIds.ETHEREUM].logo}
                          className="m-auto h-[45px]"/>
                      })
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
              </div>*/}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Mint
