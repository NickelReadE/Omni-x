import React from "react";
import Link from "next/link";
import { LaunchPadType } from "../../types/collections";
import { formatDollarAmount } from "../../utils/numbers";
import { TextBodyemphasis, TextH3 } from "../common/Basic";

const DropCard = ({ collection }: { collection: LaunchPadType }) => {
  return (
    <Link href={`/drops/${collection.col_url}`}>
      <div className='flex flex-col bg-[#202020] border-[#F8F9FA] rounded-[8px] hover:cursor-pointer'>
        <div className={"relative"}>
          <div className={"group relative flex justify-center text-center overflow-hidden rounded-tr-lg rounded-tl-lg"}>
            <img className='w-[270px] h-[270px]' src={collection.profile_image} alt='nft-image' />
          </div>
        </div>

        <div className={"flex flex-col pt-3 px-3 pb-4"}>
          <TextH3 className='text-primary-light'>{collection.name}</TextH3>
          <TextBodyemphasis className={"text-transparent bg-primary-gradient bg-clip-text mt-3"}>
            {formatDollarAmount(collection.floor_price)} - {formatDollarAmount(collection.ceil_price)}
          </TextBodyemphasis>
        </div>
      </div>
    </Link>
  );
};
export default DropCard;
