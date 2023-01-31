import React, {useEffect, useMemo, useState} from 'react'
import Image from 'next/image'
import useWallet from '../../hooks/useWallet'
import {ExternalLink, TextBody, TextBodyemphasis, TextH2} from '../common/Basic'
import WebsiteIcon from '../../public/images/icons/website.svg'
import TwitterIcon from '../../public/images/icons/twitter.svg'
import DiscordIcon from '../../public/images/icons/discord.svg'
import TelegramIcon from '../../public/images/icons/telegram.svg'
import {getRoyalty} from '../../utils/helpers'
import {formatDollarAmount} from '../../utils/numbers'
import {FullCollectionType} from '../../types/collections'
import { CopyAddressButton } from '../common/buttons/CopyAddressButton'

interface CollectionBannerProps {
    collection: FullCollectionType,
    setSelectedTabIndex: (index: number) => void,
}

export const CollectionBanner = ({ collection, setSelectedTabIndex }: CollectionBannerProps) => {
  const { chainId } = useWallet()

  const [royalty, setRoyalty] = useState<number>(0)
  const [selectedTab, setSelectedTab] = useState(0)

  const collectionAddress = useMemo(() => {
    if (chainId) {
      return collection.address[chainId.toString()]
    }
    return undefined
  }, [collection, chainId])

  const activeClasses = (index: number) => {
    return index === selectedTab ? 'bg-primary-gradient': 'bg-secondary'
  }
  const activeTextClasses = (index: number) => {
    return index === selectedTab ? 'bg-primary-gradient bg-clip-text text-transparent': 'text-secondary'
  }

  useEffect(() => {
    (async () => {
      setRoyalty(await getRoyalty('ERC721', '0x4aA142f1Db95B50dA7ca22267Da557050f9A7Ec9', 5))
    })()
  }, [])

  return (
    <>
      <div className={'w-full flex space-x-6'}>
        <div className="w-[200px] h-[200px]">
          <img
            src={collection.profile_image}
            alt="avatar"
            width={200}
            height={200}
            className={'rounded'}
          />
        </div>

        <div className={'flex flex-col w-full'}>
          <div className={'flex justify-between w-full'}>
            <div className={'flex flex-col space-y-2'}>
              <TextH2 className={'text-primary-light'}>{collection.name}</TextH2>
              <div className={'flex space-x-4'}>
                <TextBody className={'text-primary-light'}>by {collection.name}</TextBody>
                <CopyAddressButton address={collectionAddress ? collectionAddress : ''} />
                <div className={'w-5 h-5'}>
                  <ExternalLink link={collection.website}>
                    <WebsiteIcon/>
                  </ExternalLink>
                </div>
                <div className={'w-5 h-5'}>
                  <ExternalLink link={collection.twitter}>
                    <TwitterIcon/>
                  </ExternalLink>
                </div>
                <div className={'w-5 h-5'}>
                  <ExternalLink link={collection.discord}>
                    <DiscordIcon/>
                  </ExternalLink>
                </div>
                <div className={'w-5 h-5'}>
                  <ExternalLink link={collection.telegram}>
                    <TelegramIcon/>
                  </ExternalLink>
                </div>
              </div>
            </div>

            <div className={'flex flex-col items-end justify-between space-y-2'}>
              <div className={'flex items-center space-x-4'}>
                <div className={'flex items-center space-x-1 bg-[#202020] rounded-[20px] py-1 px-2'}>
                  <Image src={'/images/icons/heart.svg'} width={20} height={20} alt={'heart'}/>
                  <TextBodyemphasis className={'text-primary-light'}>250</TextBodyemphasis>
                </div>
                {/* <GreyButton text={'join chat'}/>
                <PrimaryButton text={'follow'}/> */}
              </div>

              <div className={'flex space-x-4'}>
                {/* <div className={'flex items-center space-x-1'}>
                  <TextBody className={'text-primary-light'}>{formatAmount(16800)}</TextBody>
                  <TextBody className={'text-secondary'}>followers</TextBody>
                </div>
                <div className={'flex items-center space-x-1'}>
                  <TextBody className={'text-primary-light'}>{formatAmount(16500)}</TextBody>
                  <TextBody className={'text-secondary'}>following</TextBody>
                </div> */}
              </div>
            </div>
          </div>

          <div className={'pt-2 flex items-center'}>
            <div className={'w-[100%] md:w-[50%] text-secondary text-md'}>
              {collection.description}
            </div>
            <div className={'w-0 md:w-[50%}'}/>
          </div>

          <div className={'flex items-center space-x-6 mt-4'}>
            <div className={'flex flex-col items-center space-y-2'}>
              <span className={'text-md text-secondary'}>items</span>
              <span className={'text-xg text-primary-light'}>{collection.itemsCnt}</span>
            </div>
            <div className={'md:flex flex-col items-center space-y-2 hidden'}>
              <span className={'text-md text-secondary'}>owners</span>
              <span className={'text-xg text-primary-light'}>{collection.ownerCnt}</span>
            </div>
            <div className={'lg:flex flex-col items-center space-y-2 hidden'}>
              <span className={'text-md text-secondary'}>creator&nbsp;fee</span>
              <span className={'text-xg text-primary-light'}>{royalty}%</span>
            </div>
            <div className={'xl:flex flex-col items-center space-y-2 hidden'}>
              <span className={'text-md text-secondary'}>total&nbsp;vol</span>
              <span className={'text-xg text-primary-light'}>{formatDollarAmount(Number(collection.total_volume))}</span>
            </div>
            <div className={'2xl:flex flex-col items-center space-y-2 hidden'}>
              <span className={'text-md text-secondary'}>7d&nbsp;vol</span>
              <span className={'text-xg text-primary-light'}>{formatDollarAmount(Number(collection.volume7d))}</span>
            </div>
            <div className={'2xl:flex flex-col items-center space-y-2 hidden'}>
              <span className={'text-md text-secondary'}>listed</span>
              <span className={'text-xg text-primary-light'}>{collection.orderCnt}</span>
            </div>
          </div>
        </div>
      </div>

      {/*items & activity Tabs section*/}
      <div className={'flex items-center mt-10'}>
        <div className="text-xl font-medium text-center text-secondary">
          <ul className="flex flex-wrap -mb-px">
            <li onClick={() => {
              setSelectedTab(0)
              setSelectedTabIndex(0)
            }}>
              <div className={`${activeClasses(0)} pb-[2px] cursor-pointer`}>
                <div className={'flex flex-col justify-between h-full bg-primary text-white py-1 px-4'}>
                  <span className={`${activeTextClasses(0)}`}>items</span>
                </div>
              </div>
            </li>
            {/*<li onClick={() => {
            setSelectedTab(1)
            setSelectedTabIndex(1}}>
              <div className={`${activeClasses(1)} pb-[2px] cursor-pointer`}>
                <div className={'flex flex-col justify-between h-full bg-primary text-white py-1 px-4'}>
                  <span className={`${activeTextClasses(1)}`}>created</span>
                </div>
              </div>
            </li>*/}
            <li onClick={() => {
              setSelectedTab(2)
              setSelectedTabIndex(2)
            }}>
              <div className={`${activeClasses(2)} pb-[2px] cursor-pointer`}>
                <div className={'flex flex-col justify-between h-full bg-primary text-white py-1 px-4'}>
                  <span className={`${activeTextClasses(2)}`}>activity</span>
                </div>
              </div>
            </li>
            <li onClick={() => {
              setSelectedTab(3)
              setSelectedTabIndex(3)
            }}>
              <div className={`${activeClasses(3)} pb-[2px] cursor-pointer`}>
                <div className={'flex flex-col justify-between h-full bg-primary text-white py-1 px-4'}>
                  <span className={`${activeTextClasses(3)}`}>posts</span>
                </div>
              </div>
            </li>
            {/*<li onClick={() => setSelectedTab(4)}>
              <div className={`${activeClasses(4)} pb-[2px] cursor-pointer`}>
                <div className={'flex flex-col justify-between h-full bg-primary text-white py-1 px-4'}>
                  <span className={`${activeTextClasses(4)}`}>hidden</span>
                </div>
              </div>
            </li>*/}
          </ul>
        </div>
      </div>
    </>
  )
}
