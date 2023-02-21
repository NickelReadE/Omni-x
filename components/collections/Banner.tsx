import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import useWallet from "../../hooks/useWallet";
import { ExternalLink, TextBody, TextBodyemphasis, TextH2 } from "../common/Basic";
import WebsiteIcon from "../../public/images/icons/website.svg";
import TwitterIcon from "../../public/images/icons/twitter.svg";
import DiscordIcon from "../../public/images/icons/discord.svg";
import TelegramIcon from "../../public/images/icons/telegram.svg";
import { getRoyalty } from "../../utils/helpers";
import { formatDollarAmount } from "../../utils/numbers";
import { FullCollectionType } from "../../types/collections";
import { CopyAddressButton } from "../common/buttons/CopyAddressButton";
import { userService } from "../../services/users";
import { activeClasses, activeTextClasses } from '../../utils/utils';

interface CollectionBannerProps {
  collection: FullCollectionType;
  setSelectedTabIndex: (index: number) => void;
}

export const CollectionBanner = ({ collection, setSelectedTabIndex }: CollectionBannerProps) => {
  const { address, chainId } = useWallet();

  const [royalty, setRoyalty] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState(0);

  const collectionAddress = useMemo(() => {
    if (chainId) {
      return collection.address[chainId.toString()];
    }
    return undefined;
  }, [collection, chainId]);

  const onFavoriteClicked = async () => {
    try {
      if (address) {
        await userService.addFavoriteCollection(address, collection.col_url);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    (async () => {
      setRoyalty(await getRoyalty("ERC721", "0x4aA142f1Db95B50dA7ca22267Da557050f9A7Ec9", 5));
    })();
  }, []);

  return (
    <>
      <div className={"w-full flex space-x-6 min-h-[200px] max-h-[200px] display: inline-block box-sizing: border-box;"}>
        <div className='w-[200px] h-[200px]'>
          <img
            src={collection.profile_image}
            alt='avatar'
            width={200}
            height={200}
            className={"rounded min-h-[200px] min-w-[200px] max-h-[200px]"}
          />
        </div>

        <div className={"flex flex-col w-full max-h-[200px]"}>
          <div className={"flex justify-between max-h-[200px]"}>
            <div className={"flex flex-col space-y-2 max-h-[200px]"}>
              <TextH2 className={"text-primary-light"}>{collection.name}</TextH2>
              <div className={"flex space-x-4"}>
                <TextBody className={"text-primary-light"}>by {collection.creator_name}</TextBody>
                <CopyAddressButton address={collectionAddress ? collectionAddress : ""} />
                <div className={"w-5 h-5"}>
                  <ExternalLink link={collection.website}>
                    <WebsiteIcon />
                  </ExternalLink>
                </div>
                <div className={"w-5 h-5"}>
                  <ExternalLink link={collection.twitter}>
                    <TwitterIcon />
                  </ExternalLink>
                </div>
                <div className={"w-5 h-5"}>
                  <ExternalLink link={collection.discord}>
                    <DiscordIcon />
                  </ExternalLink>
                </div>
                <div className={"w-5 h-5"}>
                  <ExternalLink link={collection.telegram}>
                    <TelegramIcon />
                  </ExternalLink>
                </div>
              </div>
            </div>

            <div className={"flex flex-col items-end justify-between space-y-2"}>
              <div className={"flex items-center space-x-4"}>
                <div className={"flex items-center space-x-1 bg-[#202020] rounded-[20px] py-1 px-2"}>
                  <Image
                    src={"/images/icons/heart.svg"}
                    width={20}
                    height={20}
                    alt={"heart"}
                    className={"cursor-pointer"}
                    onClick={onFavoriteClicked}
                  />
                  <TextBodyemphasis className={"text-primary-light"}>{collection.likes}</TextBodyemphasis>
                </div>
                {/* <GreyButton text={'join chat'}/>
                <PrimaryButton text={'follow'}/> */}
              </div>

              <div className={"flex space-x-4"}>
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

          <div className={"pt-2 flex items-center"}>
            <div className={"w-[100%] md:w-[90%] text-secondary text-md"}>
              {collection.description.length > 200 ? collection.description.slice(0, 200) + "..." : collection.description}
            </div>
            <div className={"w-0 md:w-[50%}"} />
          </div>

          <div className={"flex items-center space-x-6 my-3 whitespace-nowrap "}>
            <div className={"flex flex-col items-center space-y-2 "}>
              <span className={"text-md text-secondary"}>items</span>
              <span className={"text-xg text-primary-light"}>{collection.items_count}</span>
            </div>
            <div className={"flex flex-col items-center space-y-2 "}>
              <span className={"text-md text-secondary"}>owners</span>
              <span className={"text-xg text-primary-light"}>{collection.owner_count}</span>
            </div>
            <div className={"flex flex-col items-center space-y-2 "}>
              <span className={"text-md text-secondary"}>creator&nbsp;fee</span>
              <span className={"text-xg text-primary-light"}>{royalty}%</span>
            </div>
            <div className={"flex flex-col items-center space-y-2 "}>
              <span className={"text-md text-secondary"}>total&nbsp;vol</span>
              <span className={"text-xg text-primary-light"}>{formatDollarAmount(Number(collection.total_volume))}</span>
            </div>
            <div className={"flex flex-col items-center space-y-2 "}>
              <span className={"text-md text-secondary"}>7d&nbsp;vol</span>
              <span className={"text-xg text-primary-light"}>{formatDollarAmount(Number(collection.volume7d))}</span>
            </div>
            <div className={"flex flex-col items-center space-y-2 "}>
              <span className={"text-md text-secondary"}>listed</span>
              <span className={"text-xg text-primary-light"}>{collection.listed_count}</span>
            </div>
          </div>
        </div>
      </div>

      {/*items & activity Tabs section*/}
      <div className={"flex items-center mt-10"}>
        <div className='text-xl font-medium text-center'>
          <ul className='flex flex-wrap -mb-px'>
            <li
              onClick={() => {
                setSelectedTab(0);
                setSelectedTabIndex(0);
              }}
            >
              <div className={`${activeClasses(0,selectedTab)} pb-[2px] cursor-pointer`}>
                <div className={"flex flex-col justify-between h-full bg-primary text-white py-1 px-4"}>
                  <span className={`${activeTextClasses(0,selectedTab)}`}>items</span>
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
            <li
              onClick={() => {
                setSelectedTab(2);
                setSelectedTabIndex(2);
              }}
            >
              <div className={`${activeClasses(2,selectedTab)} pb-[2px] cursor-pointer`}>
                <div className={"flex flex-col justify-between h-full bg-primary text-[white] py-1 px-4"}>
                  <span className={`${activeTextClasses(2,selectedTab)}`}>activity</span>
                </div>
              </div>
            </li>
            <li
              onClick={() => {
                setSelectedTab(3);
                setSelectedTabIndex(3);
              }}
            >
              <div className={`${activeClasses(3,selectedTab)} pb-[2px] cursor-pointer`}>
                <div className={"flex flex-col justify-between h-full bg-primary text-white py-1 px-4"}>
                  <span className={`${activeTextClasses(3,selectedTab)}`}>posts</span>
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
  );
};
