export interface IPropsImage {
  nfts: Array<NFTItem>,
  isLoading: boolean,
}

export interface IPropsNFTItem {
  nft: NFTItem,
  col_url?: string,
  chain?: string,
  col_address?:string,
  onRefresh: () => void
}

export interface NFTItem {
  name: string,
  attributes: any,
  image: string,
  token: string,
  score: number,
  rank: number,
  token_id: string,
  price: number,
  last_sale_price:number,
  last_sale_currency:string,
  chain_id:number,
  col_url: string,
  metadata: string,
  token_uri: string,
  amount: string,
  contract_type: string,
  owner: string,
  collection_address: string,
  currency: string,
  order_data: any,
  bid_datas: any[],
  bid_order_data: any[],
}

export interface IGetOrderRequest {
  isOrderAsk?: boolean,
  chain?: string,
  chain_id?: number,
  collection?: string,
  tokenId?: string,
  signer?: string,
  nonce?: string,
  strategy?: string,
  currency?: string,
  price?: any,
  startTime?: string,
  endTime?: string,
  status?: [string],
  pagination?: any,
  sort?: string
}

export interface IOrder {
  chain: string,
  chain_id: number,
  collectionAddress: string,
  tokenId: string,
  isOrderAsk: boolean,
  signer: string,
  strategy: string,
  currencyAddress: string,
  amount: number,
  price: string,
  nonce: string,
  startTime: number,
  endTime: number,
  minPercentageToAsk: number,
  params: any[],
  signature: string,
  v: number,
  r: string,
  s: string,
  hash: string,
  status: OrderStatus,
  updatedAt: string,
}

export type OrderStatus = 'EXECUTED' | 'EXPIRED'

export interface IAcceptOrderRequest {
  hash: string,
  status: OrderStatus
}

export interface IListingData {
  price: number,
  currencyName: string,
  period: number,
  isAuction: boolean
}

export interface IBidData {
  price: number,
  currencyName: string
}
