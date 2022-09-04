import { SupportedChainId, Addresses } from '../types'

const rinkebyAddresses: Addresses = {
  EXECUTION_MANAGER: '0x288d35d00e07Ab7eCF32BB5c44FF1c7c73c154b3',
  EXCHANGE: '0x8405eA012aC6a3Ac998e42793e3275e011cf8E4e',
  ROYALTY_FEE_MANAGER: '0x024a1a26F1a9D3E5311259F1a6Dcfb5Dd64E8509',
  ROYALTY_FEE_REGISTRY: '0xAf747dF75ee811f579d52D3B820352B660AEc167',
  STRATEGY_STANDARD_SALE: '0xA58A8e5F383D8b64492Be3eEa94f36D98d3d4650',
  TRANSFER_MANAGER_ERC721: '0xABABA714CfAD89dF305b92b46F2327fcE78ab136',
  TRANSFER_MANAGER_ERC1155: '0x03CBf1138695fC41735395814554a58AFC8aF240',
  TRANSFER_MANAGER_GHOSTS: '0x63DD17BF5524303EaF8bfD96DBa8285894A523C3',
  TRANSFER_MANAGER_ONFT721: '0x5D2ee1079a05AD0d1A3917D555B38f774D2B74aC',
  TRANSFER_MANAGER_ONFT1155: '0x07C8Cc40B10337329Bd98910dfFb867aBE184499',
  TRANSFER_SELECTOR_NFT: '0xC112F59fd9E943c251E116A3E5486Cebe90C2015',
  OFT: '0x5837469Bfde42BA19bBE1dc6fCe6f44e95121528',
  WETH: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  CURRENCY_MANAGER: '0x931CacCa180ab3d78aCD8459eEdd60EDe5dB7469',
  REMOTE_ADDRESS_MANAGER: '0xdA0c422fC4C1c876C5355ED679ac4B709A2750AD',
}

export const addressesByNetwork: { [chainId in SupportedChainId]: Addresses } = {
  [SupportedChainId.RINKEBY]: rinkebyAddresses,
}


export const chains = ['eth', 'bsc', 'matic', 'avalanche', 'fantom', 'optimism', 'arbitrum']
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
export const veSTGContractAddresses:string[]=[
  '0x0e42acBD23FAee03249DAFF896b78d7e79fBD58E',
  '0xD4888870C8686c748232719051b677791dBDa26D',
  '0x3AB2DA31bBD886A7eDF68a6b60D3CDe657D3A15D',
  '0xfBd849E6007f9BC3CC2D6Eb159c045B8dc660268',
  '0x43d2761ed16C89A2C4342e2B16A3C61Ccf88f05B',
  '0x933421675cDC8c280e5F21f0e061E77849293dba'
]
