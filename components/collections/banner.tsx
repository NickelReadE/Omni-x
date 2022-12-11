import {CollectionType} from '../../hooks/useCollection'
import React, {useEffect, useMemo, useState} from 'react'
import {truncateAddress} from '../../utils/utils'
import useWallet from '../../hooks/useWallet'
import {ExternalLink} from '../basic'
import WebsiteIcon from '../../public/images/icons/website.svg'
import TwitterIcon from '../../public/images/icons/twitter.svg'
import DiscordIcon from '../../public/images/icons/discord.svg'
import TelegramIcon from '../../public/images/icons/telegram.svg'
import {PrimaryButton} from '../common/buttons/PrimaryButton'
import {getRoyalty} from '../../utils/helpers'

interface CollectionBannerProps {
    collection: CollectionType
}

export const CollectionBanner = ({ collection }: CollectionBannerProps) => {
  const { chainId } = useWallet()

  const [royalty, setRoyalty] = useState<number>(0)
  const [moreOrLess, setMoreOrLess] = useState(false)
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
    <div className={'w-full grid grid-cols-4 lg:grid-cols-6'}>
      <div className={'hidden lg:block'} />
      <div className={'col-span-4'}>
        <div className={'relative'}>
          <img
            src={collection.banner_image}
            className="banner-slider h-full w-full"
            alt={'banner'}
          />
          <div className="bottom-[-80px] left-6 h-[120px] absolute flex items-end">
            <img
              src={collection.profile_image}
              alt="avatar"
              width={120}
              height={120}
              className={'rounded-lg'}
            />
          </div>
        </div>

        <div className={'flex items-center justify-between w-full pl-[160px] pt-5'}>
          {/*Collection information section*/}
          <div className={'flex flex-col space-y-2'}>
            <span className={'text-xg1 text-primary-light'}>{collection.name}</span>
            <span className={'text-md text-secondary'}>{collectionAddress ? truncateAddress(collectionAddress) : ''}</span>
          </div>
          <div className={'flex items-center space-x-6'}>
            <div className={'flex flex-col items-center space-y-2'}>
              <span className={'text-xg text-primary-light'}>{collection.itemsCnt}</span>
              <span className={'text-md text-secondary'}>items</span>
            </div>
            <div className={'md:flex flex-col items-center space-y-2 hidden'}>
              <span className={'text-xg text-primary-light'}>{collection.ownerCnt}</span>
              <span className={'text-md text-secondary'}>owners</span>
            </div>
            <div className={'lg:flex flex-col items-center space-y-2 hidden'}>
              <span className={'text-xg text-primary-light'}>{royalty}%</span>
              <span className={'text-md text-secondary'}>creator&nbsp;fee</span>
            </div>
            <div className={'xl:flex flex-col items-center space-y-2 hidden'}>
              <span className={'text-xg text-primary-light'}>{collection.itemsCnt}</span>
              <span className={'text-md text-secondary'}>total&nbsp;vol</span>
            </div>
            <div className={'2xl:flex flex-col items-center space-y-2 hidden'}>
              <span className={'text-xg text-primary-light'}>{collection.itemsCnt}</span>
              <span className={'text-md text-secondary'}>7d&nbsp;vol</span>
            </div>
            <div className={'2xl:flex flex-col items-center space-y-2 hidden'}>
              <span className={'text-xg text-primary-light'}>{collection.itemsCnt}</span>
              <span className={'text-md text-secondary'}>listed</span>
            </div>
          </div>
          <div className={'flex flex-col space-y-2'}>
            <PrimaryButton text={'following'} className={'h-[26px] text-md font-medium'} />
            <span className={'text-md text-primary-light'}>1.65k followers</span>
          </div>
          {/*Social buttons section*/}
          <div className={'flex items-center space-x-3'}>
            <div className={'w-8 h-8 p-1'}>
              <ExternalLink link={collection.website}>
                <WebsiteIcon />
              </ExternalLink>
            </div>
            <div className={'w-8 h-8 p-1'}>
              <ExternalLink link={collection.twitter}>
                <TwitterIcon />
              </ExternalLink>
            </div>
            <div className={'w-8 h-8 p-1'}>
              <ExternalLink link={collection.discord}>
                <DiscordIcon />
              </ExternalLink>
            </div>
            <div className={'w-8 h-8 p-1'}>
              <ExternalLink link={collection.telegram}>
                <TelegramIcon />
              </ExternalLink>
            </div>
          </div>
        </div>

        {/*Collection description section*/}
        <div className={'pl-[160px] pt-2 flex items-center'}>
          <span className={`text-secondary ${moreOrLess ? '' : 'truncate'} text-md`}>
            {collection.description}
            <span className={'bg-primary-gradient bg-clip-text text-center text-transparent text-md cursor-pointer'} onClick={() => setMoreOrLess(!moreOrLess)}>
              {moreOrLess ? 'less' : 'more'}
            </span>
          </span>
          {
            !moreOrLess &&
              <span className={'pl-3 bg-primary-gradient bg-clip-text text-center text-transparent text-md cursor-pointer'} onClick={() => setMoreOrLess(true)}>
                more
              </span>
          }
        </div>

        {/*items & activity Tabs section*/}
        <div className={'flex items-center mt-8'}>
          <div className="text-xl font-medium text-center text-secondary">
            <ul className="flex flex-wrap -mb-px">
              <li onClick={() => setSelectedTab(0)}>
                <div className={`${activeClasses(0)} pb-[2px] cursor-pointer`}>
                  <div className={'flex flex-col justify-between h-full bg-primary text-white py-1 px-4'}>
                    <span className={`${activeTextClasses(0)}`}>collected</span>
                  </div>
                </div>
              </li>
              <li onClick={() => setSelectedTab(1)}>
                <div className={`${activeClasses(1)} pb-[2px] cursor-pointer`}>
                  <div className={'flex flex-col justify-between h-full bg-primary text-white py-1 px-4'}>
                    <span className={`${activeTextClasses(1)}`}>created</span>
                  </div>
                </div>
              </li>
              <li onClick={() => setSelectedTab(2)}>
                <div className={`${activeClasses(2)} pb-[2px] cursor-pointer`}>
                  <div className={'flex flex-col justify-between h-full bg-primary text-white py-1 px-4'}>
                    <span className={`${activeTextClasses(2)}`}>activity</span>
                  </div>
                </div>
              </li>
              <li onClick={() => setSelectedTab(3)}>
                <div className={`${activeClasses(3)} pb-[2px] cursor-pointer`}>
                  <div className={'flex flex-col justify-between h-full bg-primary text-white py-1 px-4'}>
                    <span className={`${activeTextClasses(3)}`}>favorites</span>
                  </div>
                </div>
              </li>
              <li onClick={() => setSelectedTab(4)}>
                <div className={`${activeClasses(4)} pb-[2px] cursor-pointer`}>
                  <div className={'flex flex-col justify-between h-full bg-primary text-white py-1 px-4'}>
                    <span className={`${activeTextClasses(4)}`}>hidden</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={'hidden lg:block'} />
    </div>
  )
}
