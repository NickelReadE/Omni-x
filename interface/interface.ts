import React from 'react'

export interface IPropsSlider {
  title?: string
  cards: Array<React.ReactNode>
}

export interface IPropsImage {
  nfts: Array<NFTItem>
}

export interface IPropsFeed {
  feed: Array<FeedItem>
}

export interface IPropsNFTItem {
  nft: NFTItem,
  col_url?: string,
  chain?: string,
  col_address?:string,
  index: number
}

export interface NFTItem {
  name: string,
  attributes: Object,
  image: string,
  custom_id: number,
  token: string,
  score: number,
  rank: number,
  token_id: string,
  name1: string,
  price: number,
  metadata: string,
  token_uri: string,
  amount: string,
  contract_type: string,
  chain: string,
  token_address: string,
  uri: string,
}

export interface FeedItem {
  image: React.ReactNode
  love: number
  view: number
  chain: string
  title: string
  id: string
  owner: string
  postedby: string
  alert?: {
    content: string
    percent: number
  }
}

export const ItemTypes = {
  NFTBox: 'nftbox'
}

export interface IGetOrderRequest {
  isOrderAsk?: boolean,
  chain?: string,
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
  params: [],
  signature: string,
  v: number,
  r: string,
  s: string,
  status: string
}

export interface IAcceptOrderRequest {
  hash: string,
  status: string
}