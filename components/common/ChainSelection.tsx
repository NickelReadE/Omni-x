import { Fragment, useMemo, useState } from "react";
import { getChainNameFromId, SUPPORTED_CHAIN_IDS } from "../../utils/constants";
import { ChainIds } from "../../types/enum";
import { Transition } from "@headlessui/react";
import { ChainIcon } from "./ChainIcon";

interface IChainSelectionProps {
  selectedChainIds: number[];
  addChainId: (chainId: number) => void;
  removeChainId: (chainId: number) => void;
  addAllChainIds: () => void;
  setChainId: (chainId: number) => void;
}

export const ChainSelection = ({ selectedChainIds, addChainId, removeChainId, addAllChainIds, setChainId }: IChainSelectionProps) => {
  const [isShow, setIsShow] = useState(false);

  const activeChainIds = useMemo(() => {
    return SUPPORTED_CHAIN_IDS.filter((chainId) => !selectedChainIds.includes(chainId));
  }, [selectedChainIds]);

  const removeFromList = (chainId: number) => {
    if (selectedChainIds.length > 1) {
      removeChainId(chainId);
    }
  };

  return (
    <>
      {
        <div className='flex flex-row justify-items-center' onMouseLeave={() => setIsShow(false)}>
          <div className={"flex items-center space-x-2"} onMouseEnter={() => setIsShow(true)}>
            {selectedChainIds.length !== SUPPORTED_CHAIN_IDS.length ? (
              selectedChainIds.map((chainId: number, index) => {
                return (
                  <ChainIcon
                    key={index}
                    chainName={getChainNameFromId(chainId)}
                    size={"large"}
                    isSelected={true}
                    onClick={() => removeFromList(chainId)}
                  />
                );
              })
            ) : (
              <span className={"text-primary-light text-md cursor-pointer"}>all networks</span>
            )}
          </div>
          <Transition
            as={Fragment}
            enter='transition origin-left ease-out duration-150'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-100'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
            show={isShow}
          >
            <div className={"flex items-center space-x-2 ml-2"}>
              <div className={"flex items-center"}>
                <div className={"h-full w-[2px] bg-primary-light h-[18px] rounded-sm"} />
              </div>
              {activeChainIds.length > 0 && (
                <div
                  className={"flex items-center font-medium cursor-pointer ml-[1px] text-secondary hover:text-primary-light"}
                  onClick={addAllChainIds}
                >
                  <span className={"text-md"}>all</span>
                </div>
              )}
              {activeChainIds.length === 0
                ? SUPPORTED_CHAIN_IDS.map((chainId: ChainIds, index) => {
                    return (
                      <ChainIcon key={index} chainName={getChainNameFromId(chainId)} size={"large"} onClick={() => setChainId(chainId)} />
                    );
                  })
                : activeChainIds.map((chainId: ChainIds, index) => {
                    return (
                      <ChainIcon key={index} chainName={getChainNameFromId(chainId)} size={"large"} onClick={() => addChainId(chainId)} />
                    );
                  })}
            </div>
          </Transition>
        </div>
      }
    </>
  );
};
