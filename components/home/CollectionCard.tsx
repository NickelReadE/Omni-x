import React, { useMemo } from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import classNames from "../../helpers/classNames";
import useWallet from "../../hooks/useWallet";
import { ModalIDs } from "../../contexts/modal";
import { useModal } from "../../hooks/useModal";
import { TextBodyemphasis, TextH3 } from "../common/Basic";
import { formatDollarAmount } from "../../utils/numbers";
import { OmniCollectionType } from "../../types/collections";

const CollectionCard = ({ collection, ethPrice }: { collection: OmniCollectionType; ethPrice: number }) => {
  const { address } = useWallet();
  const { openModal, closeModal } = useModal();
  /*const { totalUSDCBalance, totalUSDTBalance } = useData();
  const { data: nativeBalance } = useBalance({
    address: `0x${address?.substring(2)}`
  });*/
  const [hover, setHover] = useState<boolean>(false);
  const [imageError, setImageError] = useState(false);

  const collectionBid = {
    collectionUrl: collection.col_url as string,
    collectionAddressMap: collection.address
  };

  const onBuyFloor = (nft: any) => {
    const tradingInput = {
      collectionUrl: collectionBid.collectionUrl,
      collectionAddressMap: collectionBid.collectionAddressMap,
      tokenId: nft.token_id,
      selectedNFTItem: nft
    };

    openModal(ModalIDs.MODAL_BUY, {
      nftImage: nft.image,
      nftTitle: nft.name,
      nftTokenId: nft.token_id,
      collectionName: collection.name,
      order: nft.order,
      tradingInput,
      instantBuy: true,
      handleBuyDlgClose: closeModal
    });
  };

  const getValidFloorNFT = () => {
    return collection.floor_nft.usd;
    /*for (const kind in collection.floorPrice) {
      const floorPrice = collection.floorPrice[kind];
      if (floorPrice > 0) {
        if (kind === "usd" || kind === "usdc" || kind === "usdt") {
          if (floorPrice <= totalUSDCBalance || floorPrice <= totalUSDTBalance) {
            return collection.floor_nft[kind];
          }
        } else if (kind === "eth" && nativeBalance?.formatted) {
          // if (floorPrice <= (+nativeBalance.formatted))
          return collection.floor_nft[kind];
        }
      }
    }*/
  };

  const floor_price = useMemo(() => {
    if (collection.floor_prices.ethereum === 0) {
      return collection.floor_prices.stable;
    }
    if (collection.floor_prices.stable === 0) {
      return collection.floor_prices.ethereum * ethPrice;
    }
    return Math.min(collection.floor_prices.ethereum * ethPrice, collection.floor_prices.stable);
  }, [collection, ethPrice]);

  const ceil_price = useMemo(() => {
    if (collection.ceil_prices.ethereum === 0) {
      return collection.ceil_prices.stable;
    }
    if (collection.ceil_prices.stable === 0) {
      return collection.ceil_prices.ethereum * ethPrice;
    }
    return Math.max(collection.ceil_prices.ethereum * ethPrice, collection.ceil_prices.stable);
  }, [collection, ethPrice]);
  return (
    <div
      className={classNames("relative bg-[#202020] rounded-lg hover:shadow-[0_0_12px_rgba(160,179,204,0.3)] max-w-[340px]")}
      onMouseEnter={() => {
        if (address) setHover(true);
      }}
      onMouseLeave={() => setHover(false)}
    >
      <div className='relative cursor-pointer'>
        <Link href={`/collections/${collection.col_url}`}>
          <div>
            <img
              className='nft-image w-full rounded-tr-[8px] rounded-tl-[8px] background-fill'
              src={imageError ? "/images/omni-logo-mint-cropped.jpg" : collection.profile_image}
              alt='nft-image'
              onError={() => {
                setImageError(true);
              }}
              data-src={collection.profile_image}
            />
          </div>
        </Link>
      </div>

      <div className={"flex flex-col justify-between h-[90px] pt-3 px-3 pb-4"}>
        <TextH3 className={"text-primary-light"}>{collection.name}</TextH3>

        <div className='flex justify-left'>
          <TextBodyemphasis className={"text-transparent bg-primary-gradient bg-clip-text"}>
            {formatDollarAmount(floor_price)} - {formatDollarAmount(ceil_price)}
          </TextBodyemphasis>
        </div>
      </div>

      <div
        className={`flex absolute top-3 left-3 rounded-[20px] bg-primary opacity-80 items-center px-2 py-1.5 space-x-1 ${
          hover ? "block" : "hidden"
        }`}
      >
        <Image src={"/images/icons/nftbox/heart.svg"} width={20} height={18} alt={"heart"} />
      </div>

      {/* <div className={`w-full flex items-center bg-[#202020] absolute right-0 left-0 bottom-3 rounded-br-[8px] rounded-bl-[8px] px-3 ${hover ? 'block' : 'hidden'}`}> */}
      <button
        className={`bg-primary-green absolute bottom-0 w-full py-2 px-4 rounded-b-lg h-[38px] ${hover ? "block" : "hidden"}`}
        onClick={() => {
          const floorNft = getValidFloorNFT();
          if (floorNft) {
            onBuyFloor(floorNft);
          } else {
            console.log("-no floor nft to buy-");
          }
        }}
      >
        <TextBodyemphasis className={"text-primary"}>buy floor now</TextBodyemphasis>
      </button>
      {/* </div> */}
    </div>
  );
};

export default CollectionCard;
