import React, { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { useSwitchNetwork } from "wagmi";
import { getChainNameFromId, getChainOfficialNameById, SUPPORTED_CHAIN_IDS } from "../../../utils/constants";
import useWallet from "../../../hooks/useWallet";
import { GradientBackground, TextBodyemphasis } from "../../common/Basic";
import { ChainIcon } from "../../common/ChainIcon";

export const SelectNetworks = () => {
  const { chainId } = useWallet();
  const { switchNetwork } = useSwitchNetwork();
  const [hovered, setHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  return (
    <div className={"h-11"}>
      <div
        className={`relative inline-block text-left w-[140px] h-11 py-2 px-2 rounded-[8px] ${hovered ? "bg-[#303030]" : "bg-[#202020]"}`}
        onMouseLeave={() => setHovered(false)}
      >
        {chainId && (
          <div className={"focus:outline-none w-full h-full"} onMouseEnter={() => setHovered(true)}>
            <div className={"flex items-center space-x-2"}>
              <ChainIcon chainName={getChainNameFromId(chainId)} size={"medium"} />
              <TextBodyemphasis className={"text-secondary"}>{getChainOfficialNameById(chainId)}</TextBodyemphasis>
            </div>
          </div>
        )}
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
          show={hovered}
        >
          <div className={`absolute top-0 left-0 origin-top-left w-[140px] ${hovered ? "block" : "hidden"}`}>
            <GradientBackground className='shadow-[0_0px_250px_rgba(0,0,0,1)]'>
              <div className={"rounded-[8px] mx-[1px] p-[1px]"}>
                {SUPPORTED_CHAIN_IDS.map((chainId, index) => {
                  return (
                    <div
                      key={index}
                      className={`p-2 flex items-center space-x-2 cursor-pointer overflow-hidden ${
                        activeIndex === index ? "bg-[#303030]" : ""
                      } ${index === 0 ? "rounded-t-[8px]" : ""} ${index === SUPPORTED_CHAIN_IDS.length - 1 ? "rounded-b-[8px]" : ""}`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(undefined)}
                      onClick={() => switchNetwork?.(chainId)}
                    >
                      <ChainIcon chainName={getChainNameFromId(chainId)} isSelected={activeIndex === index} size={"medium"} />
                      <TextBodyemphasis className={`${activeIndex === index ? "text-white" : "text-secondary"} leading-none`}>
                        {getChainOfficialNameById(chainId)}
                      </TextBodyemphasis>
                    </div>
                  );
                })}
              </div>
            </GradientBackground>
          </div>
        </Transition>
      </div>
    </div>
  );
};
