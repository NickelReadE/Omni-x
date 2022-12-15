import type {NextPage} from 'next'
import {useRouter} from 'next/router'
import {ethers} from 'ethers'
import React, {useState, useEffect, useCallback} from 'react'
import {
  getAdvancedONFT721Instance,
  getCurrencyInstance,
  getGaslessONFT721Instance,
} from '../../../utils/contracts'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {Slide} from 'react-toastify'
import useWallet from '../../../hooks/useWallet'
import useCollection from '../../../hooks/useCollection'
import {ExternalLink} from '../../../components/basic'
import WebsiteIcon from '../../../public/images/icons/website.svg'
import TwitterIcon from '../../../public/images/icons/twitter.svg'
import TelegramIcon from '../../../public/images/icons/telegram.svg'
import DiscordIcon from '../../../public/images/icons/discord.svg'
import {SkeletonCard} from '../../../components/skeleton/card'
import {WhitelistCard} from '../../../components/launchpad/WhitelistCard'
import {Logger} from 'ethers/lib/utils'
import { isSupportGelato } from '../../../utils/constants'
import { useGaslessMint } from '../../../hooks/useGelato'

const Mint: NextPage = () => {
  const { chainId, signer, provider, address } = useWallet()
  const router = useRouter()
  const col_url = router.query.collection as string
  const { collectionInfo } = useCollection(col_url)

  const [totalNFTCount, setTotalNFTCount] = useState<number>(0)
  const [isMinting, setIsMinting] = useState<boolean>(false)
  const [price, setPrice] = useState(0)
  const [startId, setStartId] = useState(0)
  const [totalCnt, setTotalCnt] = useState(0)
  const [selectedTab, setSelectedTab] = useState(0)
  const { gaslessMint, waitForRelayTask } = useGaslessMint()

  const activeClasses = (index: number) => {
    return index === selectedTab ? 'bg-primary-gradient': 'bg-secondary'
  }
  const activeTextClasses = (index: number) => {
    return index === selectedTab ? 'bg-primary-gradient bg-clip-text text-transparent': 'text-secondary'
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
        const tokenContract = getAdvancedONFT721Instance(collectionInfo.address[chainId], (chainId), signer)
        setStartId(Number(collectionInfo.start_ids[chainId]))

        let decimals = 18
        if (collectionInfo.is_gasless) {
          const tokenContract = getGaslessONFT721Instance(collectionInfo.address[chainId], chainId, signer)
          const tokenAddress = await tokenContract.stableToken()
          const tokenInstance = getCurrencyInstance(tokenAddress, chainId, signer)
          decimals = Number(await tokenInstance?.decimals())
        }
        const priceT = await tokenContract.price()
        setPrice(parseFloat(ethers.utils.formatUnits(priceT, decimals)))
        const max_mint = await tokenContract.maxMintId()
        // const nextId = await tokenContract.nextMintId()
        setTotalNFTCount(max_mint.toNumber())
        // setNextTokenId(nextId.toNumber())
      }
    } catch (error) {
      console.log(error)
    }
  }, [chainId, collectionInfo, signer])

  const mint = async (quantity: number): Promise<void> => {
    if (chainId === undefined || !provider || !collectionInfo) {
      return
    }

    let tx
    setIsMinting(true)
    try {
      if (collectionInfo && collectionInfo.is_gasless && address) {
        const tokenContract = getGaslessONFT721Instance(collectionInfo.address[chainId], chainId, signer)
        const tokenAddress = await tokenContract.stableToken()
        const currencyInstance = getCurrencyInstance(tokenAddress, chainId, signer)
        if (currencyInstance) {
          const decimals = Number(await currencyInstance.decimals())
          const currencyAllowance = await currencyInstance.allowance(address, tokenContract.address)
          if (currencyAllowance.lt(ethers.utils.parseUnits(price.toString(), decimals).mul(quantity))) {
            await (await currencyInstance.approve(collectionInfo.address[chainId], ethers.utils.parseUnits((price * quantity).toString(), decimals))).wait()
          }

          if (isSupportGelato(chainId)) {
            const response = await gaslessMint(tokenContract, chainId, quantity, address)
            await waitForRelayTask(response)
          } else {
            const tx = await tokenContract.publicMint(quantity)
            await tx.wait()
          }
        }
      } else {
        const tokenContract = getAdvancedONFT721Instance(collectionInfo.address[chainId], chainId, signer)
        tx = await tokenContract.publicMint(quantity, {value: ethers.utils.parseEther((price * quantity).toString())})
        await tx.wait()
      }
      await getInfo()
    } catch (e: any) {
      console.log(e)
      if (e && e.code && e.code === Logger.errors.ACTION_REJECTED) {
        errorToast('user denied transaction signature')
      } else {
        const currentBalance = await provider.getBalance(address ? address : '')

        if (Number(currentBalance) / Math.pow(10, 18) < collectionInfo.price * quantity) {
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

  /*useEffect(() => {
    if (Number(nextTokenId) >= 0 && startId >= 0) {
      setMintedCnt(Number(nextTokenId) - startId)
    }
  }, [nextTokenId, startId])*/

  useEffect(() => {
    if (Number(totalNFTCount) >= 0 && startId >= 0) {
      setTotalCnt(Number(totalNFTCount) - startId)
    }
  }, [totalNFTCount, startId])

  return (
    <>
      <div className={'pt-8 px-8 2xl:px-[250px] xl:px-[200px] lg:px-[100px] md:px-12'}>
        {
          collectionInfo ?
            <div className={'flex space-x-[64px]'}>
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
              <div className={'w-full flex flex-1'}>
                <div className={'flex flex-col w-full'}>
                  <span className="font-medium text-primary-light text-xxl">
                    {collectionInfo.name}
                  </span>

                  {/*Icon group*/}
                  <div className={'flex items-center mt-4'}>
                    <div className={'w-8 h-8 p-1'}>
                      <ExternalLink link={collectionInfo.website}>
                        <WebsiteIcon/>
                      </ExternalLink>
                    </div>
                    <div className={'w-8 h-8 p-1'}>
                      <ExternalLink link={collectionInfo.twitter}>
                        <TwitterIcon/>
                      </ExternalLink>
                    </div>
                    <div className={'w-8 h-8 p-1'}>
                      <ExternalLink link={collectionInfo.discord}>
                        <DiscordIcon/>
                      </ExternalLink>
                    </div>
                    <div className={'w-8 h-8 p-1'}>
                      <ExternalLink link={collectionInfo.telegram}>
                        <TelegramIcon/>
                      </ExternalLink>
                    </div>
                  </div>

                  {/*creator*/}
                  <div className={'flex flex-col mt-4'}>
                    <div className={'text-secondary text-lg'}>creator</div>
                    <div className={'text-primary-light text-lg mt-2'}>@{collectionInfo.col_url.toLowerCase()}</div>
                  </div>

                  {/*items*/}
                  <div className={'flex mt-4'}>
                    <div className={'text-secondary text-lg'}>items</div>
                    <div className={'text-primary-light text-lg ml-2 text-shadow-sm2'}>{totalCnt}</div>
                  </div>

                  <WhitelistCard title={'whitelist 1'} price={0.08} mintStatus={''} maxLimit={2000} limitPerWallet={1} active={false} isMinting={isMinting} mint={mint} gasless={collectionInfo.is_gasless} />
                  <WhitelistCard title={'whitelist 2'} price={0.10} mintStatus={''} maxLimit={2000} limitPerWallet={1} active={false} isMinting={isMinting} mint={mint} gasless={collectionInfo.is_gasless} />
                  <WhitelistCard title={'public mint'} price={price} mintStatus={'public'} maxLimit={0} limitPerWallet={5} active={true} isMinting={isMinting} mint={mint} gasless={collectionInfo.is_gasless} />
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
            </div>*/}
                </div>
              </div>
            </div>
            :
            <SkeletonCard />
        }
      </div>
    </>
  )
}

export default Mint
