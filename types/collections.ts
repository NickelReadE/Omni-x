import {IOrder} from '../interface/interface'

type CollectionPrice = {
  ethereum: number
  stable: number
}

export type BaseCollectionType = {
  name: string,
  col_url: string,
  featured_image: string,
  profile_image: string,
  floor_prices: CollectionPrice,
  ceil_prices: CollectionPrice,
}

export type TopCollection = BaseCollectionType &{
  rank: number,
  total_volume: string,
  change: number,
}

export type FullCollectionType = BaseCollectionType & {
  address: any,
  items_count: number,
  owner_count: number,
  listed_count: number,
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
  is_gasless: boolean,
}

export type MintingSchedule = {
  title: string,
  start_timestamp: number;
  end_timestamp: number;
  max_limit: number,
  limit_per_wallet: number,
  currency: string; // in case native currency, should be 0x0
  price: number;
  wl?: string; // merkle root
}

export type LaunchPadType = BaseCollectionType & {
  mint_status: string,
  totalCnt: string,
  price: string,
  description: string,
  items_count: number,
  whitelist_infos: MintingSchedule[],
  mint_start_timestamp: number,
  mint_end_timestamp: number
}
