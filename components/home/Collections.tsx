import CollectionCard from "./CollectionCard";
import { SkeletonCard } from "../common/skeleton/Card";
import { TextH2, TextSH2 } from "../common/Basic";
import useOmniCollections from "../../hooks/useOmniCollections";

export default function HomeCollections({ ethPrice }: { ethPrice: number }) {
  const { loading: isCollectionLoading, collections } = useOmniCollections();

  return (
    <div className='mt-12'>
      <TextH2 className='text-white'>Omni Collections</TextH2>
      <TextSH2 className={"text-secondary"}>explore our latest Omnichain NFTs (ONFT)</TextSH2>
      <div className='w-full flex flex-wrap justify-start gap-12 mt-6'>
        {isCollectionLoading && <SkeletonCard />}
        {!isCollectionLoading &&
          collections.map((item, index) => (
            <div className='w-[340px] rounded-lg' key={index}>
              <CollectionCard collection={item} ethPrice={ethPrice} />
            </div>
          ))}
      </div>
    </div>
  );
}
