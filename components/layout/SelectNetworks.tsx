import React, { useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { getChainLogoById, getChainOfficialNameById, getChainNameFromId } from "../../utils/constants";
import { GradientBackground, TextBodyemphasis } from "../common/Basic";
import { useSwitchNetwork } from "wagmi";
import { ChainIcon } from "../common/ChainIcon";

export const SelectNetworks = ({
  selectedChainIds,
  chainList,
  type,
  opened = false,
  updateGasChainId = null
}: {
  selectedChainIds: number[];
  chainList: number[];
  type: string,
  opened: boolean,
  updateGasChainId: any;
}) => {
  const { switchNetwork } = useSwitchNetwork();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  return (
    <div>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
        show={opened}
      >
        <div className={`absolute ${type == "header" ? "top-0 left-0 origin-top-left w-[140px]" : "bottom-10 left-[-12px] w-[166px] origin-bottom-left rounded-md"} ${opened ? "block" : "hidden"}`}>
          <GradientBackground className='shadow-[0_0px_20px_rgba(231,237,245,0.25)]'>
            <div className={"rounded-[8px] mx-[1px] p-[1px]"}>
              {
                type == "footer" &&
                <Menu.Items className='focus:outline-none py-1'>
                  {chainList.map((chainID, index) => {
                    return (
                      <Menu.Item key={index} as={Fragment}>
                        <div
                          className={`py-2 px-6 flex items-center cursor-pointer ${selectedChainIds.includes(chainID) ? "" : "bg-[#303030]"
                            }`}
                          onClick={() => updateGasChainId(chainID)}
                        >
                          <img alt={"chainIcon"} src={getChainLogoById(chainID.toString())} />
                          <span className={"text-primary-light text-lg pl-4"}>{getChainOfficialNameById(chainID)}</span>
                        </div>
                      </Menu.Item>
                    );
                  })}
                </Menu.Items>
              }
              {
                type == "header" &&
                chainList.map((chainId, index) => {
                  return (
                    <div
                      key={index}
                      className={`p-2 flex items-center space-x-2 cursor-pointer overflow-hidden ${activeIndex === index || !selectedChainIds.includes(chainId) ? "bg-[#303030]" : ""
                        } ${index === 0 ? "rounded-t-[8px]" : ""} ${index === chainList.length - 1 ? "rounded-b-[8px]" : ""}`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(undefined)}
                      onClick={() => type == "header" ? switchNetwork?.(chainId) : updateGasChainId(chainId)}
                    >
                      <ChainIcon chainName={getChainNameFromId(chainId)} isSelected={activeIndex === index} size={"medium"} />
                      <TextBodyemphasis className={`${activeIndex === index ? "text-white" : "text-secondary"} leading-none`}>
                        {getChainOfficialNameById(chainId)}
                      </TextBodyemphasis>
                    </div>
                  );
                })
              }
            </div>
          </GradientBackground>
        </div>
      </Transition>
    </div>
  );
};
