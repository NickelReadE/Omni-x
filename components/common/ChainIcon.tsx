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
  size?: 'small' | 'medium' | 'large',
  isSelected?: boolean,
  onClick?: () => void
}

const ChainIcons: any = {
  'goerli': <EthIcon/>,
  'eth': <EthIcon/>,
  'bsc': <BscIcon/>,
  'bsc testnet': <BscIcon/>,
  'avalanche': <AvaxIcon/>,
  'avalanche testnet': <AvaxIcon/>,
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

export const ChainIcon = ({ chainName, size, isSelected, onClick }: IChainIconProps) => {
  const SvgIcon = ChainIcons[chainName]
  const dimension = size === 'large' ? 'w-[36px] h-[36px]' : size === 'medium' ? 'w-[28px] h-[28px]' : 'w-[20px] h-[20px]'
  return (
    <div className={twMerge(`chain-icon ${isSelected ? 'selected' : ''} ${dimension} flex items-center justify-center rounded-full`)} onClick={onClick}>
      {SvgIcon}
    </div>
  )
}
