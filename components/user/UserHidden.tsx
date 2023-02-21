import { SUPPORTED_CHAIN_IDS } from "../../utils/constants";
import { useState } from "react";
import Dropdown from "../common/Dropdown";
import { ChainSelection } from "../common/ChainSelection";
import NFTBox from "../collections/NFTBox";
import { NFTItem } from "../../interface/interface";

const sortMenu = [
  { text: "A - Z", value: "name" },
  { text: "Z - A", value: "-name" },
  { text: "last sold", value: "lastSale" },
  { text: "price ascending", value: "price" },
  { text: "price descending", value: "-price" }
];

const UserHidden = ({ items }: { items: NFTItem[] }) => {
  const [selectedChainIds, setSelectedChainIds] = useState<number[]>(SUPPORTED_CHAIN_IDS);

  const addSelectedChainId = (chainId: number) => {
    setSelectedChainIds([...selectedChainIds, chainId]);
  };

  const addAllChainIds = () => {
    setSelectedChainIds(SUPPORTED_CHAIN_IDS);
  };

  const removeSelectedChainId = (chainId: number) => {
    setSelectedChainIds(selectedChainIds.filter((id) => id !== chainId));
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onChangeSort = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onRefresh = () => {};

  return (
    <div className='w-full'>
      <div className='flex items-center space-x-8 w-full'>
        <Dropdown menus={sortMenu} onChange={onChangeSort} />
        <ChainSelection
          selectedChainIds={selectedChainIds}
          addChainId={addSelectedChainId}
          removeChainId={removeSelectedChainId}
          addAllChainIds={addAllChainIds}
          setChainId={(chainId) => setSelectedChainIds([chainId])}
        />
      </div>
      <div className='grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 mt-4'>
        {items.map((item, index) => {
          return <NFTBox key={index} nft={item} col_url={item.col_url} onRefresh={onRefresh} />;
        })}
      </div>
    </div>
  );
};

export default UserHidden;
