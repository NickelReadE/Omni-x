import {IOrder} from '../interface/interface'

export type BaseCollectionType = {
  name: string,
  col_url: string,
  featured_image: string,
  profile_image: string,
  floorPrice: number,
  ceilPrice: number,
}

export type FullCollectionType = BaseCollectionType & {
  address: any,
  itemsCnt: number,
  ownerCnt: number,
  orderCnt: number,
  total_volume: number,
  discord: string,
  twitter: string,
  telegram: string,
  website: string,
  description: string,
  attrs: any,
  bid_datas: any[],
  bid_orders: IOrder[],
  whitelist_infos: any[],
  floorPrice: any,
  floorNft: any,
  mint_start_timestamp: number,
  mint_end_timestamp: number,
  start_ids: any,
  price: number,
  contract_type: string,
  floor_price: number,
  ceil_price: number,
  volume7d: string,
  volume24h: string,
  volume48h: string,
  volume14d: string,
}

export type LaunchPadType = BaseCollectionType & {
  mint_status: string,
  totalCnt: string,
  price: string,
  description: string,
  itemsCnt: string,
  mint_start_timestamp: number,
  mint_end_timestamp: number
}
