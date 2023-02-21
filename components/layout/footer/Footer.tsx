import React, { useState } from "react";
import { Menu } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { SelectNetworks } from "../SelectNetworks";
import useOnchainPrices from "../../../hooks/useOnchainPrices";
import { GAS_SUPPORTED_CHAIN_IDS } from "../../../utils/constants";

export default function Footer() {
  const { chainInfos, gasSupportChainIds, updateGasChainId } = useOnchainPrices();
  const [hover, setHover] = useState(false);

  return (
    <div className='fixed bottom-0 w-full z-[99] h-[42px] bg-[#F6F8FC] dark:bg-[#161616] border-t-[1px] border-[#303030]'>
      <div className='flex items-center justify-between h-full px-10'>
        <div className='flex items-center h-full'>
          <Menu as='div' className='relative inline-block align-middle flex items-center'>
            {({ open }) => (
              <>
                <Menu.Button
                  className={"focus:outline-none w-5 h-5"}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  <div className={`${open ? "rotate-90" : ""} duration-300 flex items-center justify-center`}>
                    <svg width='19' height='3' viewBox='0 0 19 3' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M11 1.5C11 0.671573 10.3284 0 9.5 0C8.67157 0 8 0.671573 8 1.5C8 2.32843 8.67157 3 9.5 3C10.3284 3 11 2.32843 11 1.5Z'
                        fill={!open ? (hover ? "#00F0EC" : "#969696") : "#00F0EC"}
                      />
                      <path
                        d='M4 1.5C4 0.671573 3.32843 0 2.5 0C1.67157 0 1 0.671573 1 1.5C1 2.32843 1.67157 3 2.5 3C3.32843 3 4 2.32843 4 1.5Z'
                        fill={!open ? (hover ? "#00F0EC" : "#969696") : "#00F0EC"}
                      />
                      <path
                        d='M18 1.5C18 0.671573 17.3284 0 16.5 0C15.6716 0 15 0.671573 15 1.5C15 2.32843 15.6716 3 16.5 3C17.3284 3 18 2.32843 18 1.5Z'
                        fill={!open ? (hover ? "#00F0EC" : "#969696") : "#00F0EC"}
                      />
                    </svg>
                  </div>
                </Menu.Button>
                <SelectNetworks
                  type='footer'
                  opened={open}
                  chainList={GAS_SUPPORTED_CHAIN_IDS}
                  selectedChainIds={gasSupportChainIds}
                  updateGasChainId={updateGasChainId}
                />
              </>
            )}
          </Menu>
        </div>
        <div className={"flex items-center space-x-4"}>
          {chainInfos.map((item, index) => {
            return (
              <div key={index} className='flex'>
                <Image alt={"chainIcon"} src={item.icon} width={20} height={20} />
                {item.price > 0 && <span className='text-[13px] text-black dark:text-white font-normal ml-1'>${item.price}</span>}
                {item.gasFee > 0 && <span className='text-[13px] text-[#969696] font-normal ml-1'>{item.gasFee} gwei</span>}
              </div>
            );
          })}
        </div>
        <Link href={"/learn-more"}>
          <div className='flex mr-[6px] items-center h-full cursor-pointer'>
            <div className='w-[20px] h-[20px] mr-1'>
              <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M9.99529 14.1053C12.2827 14.1053 14.1371 12.251 14.1371 9.96355C14.1371 7.67611 12.2827 5.82178 9.99529 5.82178C7.70785 5.82178 5.85352 7.67611 5.85352 9.96355C5.85352 12.251 7.70785 14.1053 9.99529 14.1053Z'
                  stroke='url(#paint0_linear_185_9089)'
                  strokeWidth='2'
                  strokeMiterlimit='10'
                  strokeLinecap='round'
                />
                <path
                  d='M3.85677 14.5508C2.87577 13.226 2.34903 11.6197 2.35503 9.97125C2.36103 8.3228 2.89944 6.72041 3.89006 5.4028M14.5584 16.1383C13.2341 17.122 11.6271 17.6509 9.9775 17.6462C8.32786 17.6414 6.72401 17.1031 5.40547 16.1118M16.1255 5.42497C17.1113 6.74571 17.6439 8.34965 17.6439 9.99772C17.6439 11.6458 17.1113 13.2497 16.1255 14.5705M5.43507 3.8658C6.75913 2.88028 8.3666 2.34976 10.0172 2.35354C11.6677 2.35731 13.2727 2.89519 14.5923 3.88676'
                  stroke='url(#paint1_linear_185_9089)'
                  strokeMiterlimit='10'
                />
                <defs>
                  <linearGradient
                    id='paint0_linear_185_9089'
                    x1='7.40668'
                    y1='5.82178'
                    x2='14.4824'
                    y2='7.53062'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stopColor='#00F0EC' />
                    <stop offset='1' stopColor='#16FFC5' />
                  </linearGradient>
                  <linearGradient
                    id='paint1_linear_185_9089'
                    x1='5.22165'
                    y1='2.35352'
                    x2='18.2816'
                    y2='5.50684'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop stopColor='#00F0EC' />
                    <stop offset='1' stopColor='#16FFC5' />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className='flex items-center'>
              <div className='text-lg leading-[19px] text-primary-light'>omni&nbsp;x</div>
              <span className='text-lg leading-[19px] text-secondary ml-1'>info</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
