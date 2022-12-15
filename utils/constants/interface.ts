import GASLESS_INFO from '../../constants/gasless.json'

export const ONFT_CORE_INTERFACE_ID = '0x7bb0080b'
export const ONFT1155_CORE_INTERFACE_ID = '0x33577776'
export const ERC1155_INTERFACE_ID = '0xd9b67a26'
export const ERC721_INTERFACE_ID = '0x80ac58cd'
export const ERC2189_INTERFACE_ID = '0x2a55205a'

export const isGaslessCollection = (colUrl: string) => {
  return (GASLESS_INFO as any)[colUrl] ? true : false
}

export const isGaslessMintable = (colUrl: string, chainName: string) => {
  return (GASLESS_INFO as any)[colUrl]?.[chainName] || false
}