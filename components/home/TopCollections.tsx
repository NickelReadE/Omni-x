import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TextBody, TextHeader400, TextBodyemphasis, TextH2, TextH3 } from "../common/Basic";
import { collectionsService } from "../../services/collections";
import { formatDollarAmount } from "../../utils/numbers";
import { TopCollection } from "../../types/collections";

const CollectionRow = ({ collection, ethPrice }: { collection: TopCollection; ethPrice: number }) => {
  const floor_price = useMemo(() => {
    if (collection.floor_prices.ethereum === 0) {
      return collection.floor_prices.stable;
    }
    if (collection.floor_prices.stable === 0) {
      return collection.floor_prices.ethereum * ethPrice;
    }
    return Math.min(collection.floor_prices.ethereum * ethPrice, collection.floor_prices.stable);
  }, [collection, ethPrice]);

  return (
    <div className={"grid grid-cols-6 gap-x-6 flex items-center mt-4"}>
      <Link href={"/collections/" + collection.col_url}>
        <div className={"col-span-3 flex items-center space-x-4 cursor-pointer"}>
          <TextBody className={"text-secondary"}>{collection.rank}</TextBody>
          <div className={"bg-[#202020] rounded-[8px] w-full p-2 flex items-center space-x-3 top-collection-card"}>
            <img src={collection.profile_image} alt={"collection icon"} width={50} height={50} className={"rounded"} />
            <TextH3 className={"text-white"}>{collection.name}</TextH3>
          </div>
        </div>
      </Link>
      <TextBodyemphasis className={"col-span-1 text-white text-center"}>
        {formatDollarAmount(Number(collection.total_volume))}
      </TextBodyemphasis>
      <TextBodyemphasis className={"col-span-1 text-transparent bg-primary-gradient bg-clip-text text-center"}>
        {collection.change}%
      </TextBodyemphasis>
      <TextBodyemphasis className={"col-span-1 text-secondary text-center"}>{formatDollarAmount(floor_price)}</TextBodyemphasis>
    </div>
  );
};

//properly export this!!! same intervals are needed in UserLeaderboard.tsx
const DAY_RANGES = [
  {
    day: 1,
    displayName: "24hr"
  },
  {
    day: 7,
    displayName: "7d"
  },
  {
    day: 30,
    displayName: "30d"
  },
  {
    day: 90,
    displayName: "90d"
  },
  {
    day: 365,
    displayName: "1yr"
  },
  {
    day: 0,
    displayName: "all"
  }
];

export const HomeTopCollections = ({ ethPrice }: { ethPrice: number }) => {
  const [collections, setCollections] = useState<TopCollection[]>([]);
  const [dayRange, setDayRange] = useState(1);

  useEffect(() => {
    (async () => {
      const _collections = await collectionsService.getTopCollections(dayRange);
      setCollections(
        _collections.data.map((item: any, index: number) => {
          return {
            ...item,
            rank: index + 1
          };
        })
      );
    })();
  }, [dayRange]);

  return (
    <div className={"mt-12"}>
      <div className={"flex items-center justify-between"}>
        <div className={"flex items-center space-x-8"}>
          <TextH2 className={"text-white"}>Top Collections</TextH2>
        </div>
        <div className={"bg-[#202020] rounded-[8px] h-[38px] flex items-center rounded-bar"}>
          {DAY_RANGES.map((item, idx) => (
            <div
              key={idx}
              className={`${dayRange === item.day ? "bg-[#303030]" : ""} flex items-center justify-center py-2 px-4 cursor-pointer`}
              onClick={() => setDayRange(item.day)}
            >
              <TextBodyemphasis className={`${dayRange === item.day ? "bg-clip-text text-transparent bg-primary-gradient" : ""}`}>
                {item.displayName}
              </TextBodyemphasis>
            </div>
          ))}
        </div>
      </div>

      <div className={"flex mt-6 space-x-[120px]"}>
        <div className={"flex-1"}>
          <div className={"grid grid-cols-6 gap-x-6"}>
            <div className={"col-span-3"}></div>
            <div className={""}>
              <TextHeader400 className={"text-white text-center"}>volume</TextHeader400>
            </div>
            <div className={""}>
              <TextHeader400 className={"text-secondary text-center"}>% change</TextHeader400>
            </div>
            <div className={""}>
              <TextHeader400 className={"text-secondary text-center"}>floor</TextHeader400>
            </div>
          </div>
          {collections.slice(0, (collections.length + 1) / 2).map((collection, index) => {
            return <CollectionRow key={index} collection={collection} ethPrice={ethPrice} />;
          })}
        </div>
        <div className={"flex-1"}>
          <div className={"grid grid-cols-6 gap-x-6"}>
            <div className={"col-span-3"}></div>
            <div className={""}>
              <TextHeader400 className={"text-white text-center"}>volume</TextHeader400>
            </div>
            <div className={""}>
              <TextHeader400 className={"text-secondary text-center"}>% change</TextHeader400>
            </div>
            <div className={""}>
              <TextHeader400 className={"text-secondary text-center"}>floor</TextHeader400>
            </div>
          </div>
          {collections.slice((collections.length + 1) / 2).map((collection, index) => {
            return <CollectionRow key={index} collection={collection} ethPrice={ethPrice} />;
          })}
        </div>
      </div>
    </div>
  );
};
