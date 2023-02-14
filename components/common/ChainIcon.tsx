import React from 'react'
import {twMerge} from 'tailwind-merge'
import EthIcon from '../../public/images/chain-new/ethereum.svg'
import BscIcon from '../../public/images/chain-new/bsc.svg'
import AvaxIcon from '../../public/images/chain-new/avax.svg'
import PolygonIcon from '../../public/images/chain-new/polygon.svg'
import ArbIcon from '../../public/images/chain-new/arbitrum.svg'
import OptIcon from '../../public/images/chain-new/optimism.svg'
import FantomIcon from '../../public/images/chain-new/fantom.svg'
import MoonbeamIcon from '../../public/images/chain-new/moonbeam.svg'
import AtposIcon from '../../public/images/chain-new/aptos.svg'
import LayerZeroIcon from '../../public/images/chain-new/layerzero.svg'

interface IChainIconProps {
  chainName: string,
  disabled?: boolean,
  className?: string,
  onClick?: () => void
}

const ChainIcons: any = {
  'goerli': <EthIcon/>,
  'eth': <EthIcon/>,
  'bsc': <BscIcon/>,
  'bsc testnet': <BscIcon/>,
  'avalanche': <AvaxIcon/>,
  'fuji': <AvaxIcon/>,
  'polygon': <PolygonIcon/>,
  'mumbai': <PolygonIcon/>,
  'arbitrum': <ArbIcon/>,
  'arbitrum-goerli': <ArbIcon/>,
  'optimism': <OptIcon/>,
  'optimism-goerli': <OptIcon/>,
  'fantom': <FantomIcon/>,
  'fantom-testnet': <FantomIcon/>,
  'moonbeam': <MoonbeamIcon/>,
  'moonbeam-testnet': <MoonbeamIcon/>,
  'aptos': <AtposIcon/>,
  'aptos-testnet': <AtposIcon/>,
  'layerzero': <LayerZeroIcon/>,
}

export const ChainIcon = ({ chainName, disabled, className, onClick }: IChainIconProps) => {
  const SvgIcon = ChainIcons[chainName]
  return (
    <div className={twMerge('chain-icon flex items-center justify-center w-[20px] h-[20px] bg-[#202020] rounded-full hover:bg-[#303030]')} onClick={onClick}>
      {SvgIcon}
    </div>
  )
}
