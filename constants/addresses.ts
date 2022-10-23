import {ChainIds} from '../types/enum'

export const chains = ['eth', 'bsc', 'matic', 'avalanche', 'fantom', 'optimism', 'arbitrum', 'aptos']

export const SUPPORTED_CHAIN_IDS = [ChainIds.ETHEREUM, ChainIds.BINANCE, ChainIds.AVALANCHE, ChainIds.POLYGON, ChainIds.ARBITRUM, ChainIds.OPTIMISM, ChainIds.FANTOM, ChainIds.APTOS]

export const GregContractAddress:{[key:string]:string} = {
  'eth':'0x7FFE2672C100bFb0094ad0B4d592Dd9f9416f1AC',
  'bsc':'0xc5F4f67442E688Bc4Da2d9D8a055374e642490a4',
  'polygon' :'0x54417f05c4D5E08B079bd671d0158Ff2854a4a88',
  'avalanche':'0x018BB96D00309236E6D56046BBD8E9e083cC8CE9',
  'arbitrum':'0x6c25c2c42928Ee8D65D2C3b0a29571BD4549A96B',
  'optimism':'0xbb2e4B6e10FE9cCEBFDCa805cdCF9fA9fb65248F',
  'fantom' :'0x165865de32bA3d9552FF814C2F283964c2B61a7D'
}
export const chainsFroSTG = ['eth', 'bsc', 'matic', 'avalanche','fantom', 'optimism', 'arbitrum']
export const veSTGContractAddress:{[key:string]:string}={
  'eth':'0x0e42acBD23FAee03249DAFF896b78d7e79fBD58E',
  'bsc':'0xD4888870C8686c748232719051b677791dBDa26D',
  'matic' :'0x3AB2DA31bBD886A7eDF68a6b60D3CDe657D3A15D',
  'arbitrum':'0xfBd849E6007f9BC3CC2D6Eb159c045B8dc660268',
  'optimism':'0x43d2761ed16C89A2C4342e2B16A3C61Ccf88f05B',
  'fantom' :'0x933421675cDC8c280e5F21f0e061E77849293dba',
  'avalanche':'0xCa0F57D295bbcE554DA2c07b005b7d6565a58fCE'
}

export const RoyaltyFeeManagerAddress:{[key:string]:string} = {
  4: '0xB519cD2346A720a84336750B12AA4AA93A98aC4c',
  97: '0x6B8e0DeA5746D42A227399741fAC895732888883',
  43113: '0x5837469Bfde42BA19bBE1dc6fCe6f44e95121528',
  80001: '0xe45788A35a4BD42AE8612D71E786E7E9E0Dff8e8'
}
