import {createSlice} from '@reduxjs/toolkit'
import {Dispatch} from 'react'
import {IGetOrderRequest} from '../../interface/interface'
import {collectionsService} from '../../services/collections'
import {getOrders} from './ordersReducer'
import {getERC721Instance, getERC1155Instance, getRoyaltyFeeMangerInstance} from '../../utils/contracts'
import {RoyaltyFeeManagerAddress} from '../../constants/addresses'
import {convertETHtoUSDT, convertUSDTtoETH} from '../../utils/convertRate'
import {ethers} from 'ethers'
import axios from 'axios'
import {Alchemy} from 'alchemy-sdk'
import {
  isSupportedOnAlchemy,
  isSupportedOnMoralis,
  supportedChainsOnMoralis,
  supportedChainsOnAlchemy,
  getAPIkeyForAlchemy,
  getChainNameFromId,
  getChainIdFromName,
  currencies_list,
  getNetworForAlchemy
} from '../../utils/constants'
import {getPriceforUSD} from '../../services/datafeed'

interface CollectionState {
  nfts: any[],
  allNFTs: {},
  info: null,
  nftInfo: {},
  finishedGetting: boolean,
  owners: number,
  collections: any[],
  collectionsForCard: any[],
  royalty: number,
  collectionsForComing: any[],
  collectionsForLive: any[]
}

//reducers
export const collectionsSlice = createSlice({
  name: 'collections',
  initialState: {
    nfts: [],
    allNFTs: {},
    info: null,
    nftInfo: {},
    finishedGetting: false,
    owners: 0,
    collections: [],
    collectionsForCard: [],
    royalty: 0,
    collectionsForComing: [],
    collectionsForLive: []
  } as CollectionState,
  reducers: {
    setCollectionNFTs: (state, action) => {
      state.nfts = (action.payload === undefined || action.payload.data === undefined) ? state.nfts : state.nfts.concat(action.payload.data)
      state.finishedGetting = (action.payload === undefined || action.payload.finished === undefined) ? true : action.payload.finished
    },
    startGetNFTs: (state) => {
      state.finishedGetting = false
    },
    setCollectionInfo: (state, action) => {
      state.info = action.payload === undefined ? {} : action.payload.data
    },
    setCollectionAllNFTs: (state, action) => {
      state.allNFTs = action.payload === undefined ? {} : action.payload.data
    },
    setNFTInfo: (state, action) => {
      state.nftInfo = action.payload === undefined ? {} : action.payload.data
    },
    clearCollections: (state) => {
      state.nfts = []
    },
    setCollectionOwners: (state, action) => {
      state.owners = action.payload === undefined ? 0 : action.payload.data
    },
    setCollections: (state, action) => {
      state.collections = action.payload === undefined ? 0 : action.payload.data
    },
    setCollectionsForCard: (state, action) => {
      state.collectionsForCard = action.payload === undefined ? '' : action.payload
    },
    setRoyalty: (state, action) => {
      state.royalty = action.payload === undefined ? '' : action.payload
    },
    setCollectionsForComing: (state, action) => {

      state.collectionsForComing = action.payload === undefined ? '' : action.payload
    },
    setCollectionsForLive: (state, action) => {

      state.collectionsForLive = action.payload === undefined ? '' : action.payload
    }
  }
})

//actions
export const {
  setCollectionNFTs,
  setCollectionAllNFTs,
  setCollectionInfo,
  setNFTInfo,
  clearCollections,
  startGetNFTs,
  setCollectionOwners,
  setCollections,
  setCollectionsForCard,
  setRoyalty,
  setCollectionsForComing,
  setCollectionsForLive
} = collectionsSlice.actions

export const clearCollectionNFTs = () => (dispatch: Dispatch<any>) => {
  dispatch(clearCollections())
}

export const getCollectionNFTs = (col_url: string, page: number, display_per_page: number, sort: string, searchObj: any) => async (dispatch: Dispatch<any>) => {
  dispatch(startGetNFTs())
  try {
    const nfts = await collectionsService.getCollectionNFTs(col_url, page, display_per_page, sort, searchObj)
    dispatch(setCollectionNFTs(nfts))
  } catch (error) {
    console.log('getCollectionNFTs error ? ', error)
  }
}

export const getCollectionAllNFTs = (col_url: string, sort: string, searchObj: any) => async (dispatch: Dispatch<any>) => {
  dispatch(startGetNFTs())
  try {
    const nfts = await collectionsService.getCollectionAllNFTs(col_url, sort, searchObj)
    dispatch(setCollectionAllNFTs(nfts))
  } catch (error) {
    console.log('getCollectionAllNFTs error ? ', error)
  }
}

export const getCollectionInfo = (col_url: string) => async (dispatch: Dispatch<any>) => {
  try {
    const info = await collectionsService.getCollectionInfo(col_url)
    dispatch(setCollectionInfo(info))
  } catch (error) {
    console.log('getCollectionInfo error ? ', error)
  }
}

export const getNFTInfo = (col_url: string, token_id: string) => async (dispatch: Dispatch<any>) => {
  try {
    const info = await collectionsService.getNFTInfo(col_url, token_id)
    dispatch(setNFTInfo(info))
  } catch (error) {
    console.log('getNFTInfo error ? ', error)
  }
}

export const getCollections = () => async (dispatch: Dispatch<any>) => {
  try {
    const info = await collectionsService.getCollections()
    dispatch(setCollections(info))
  } catch (error) {
    console.log('getNFTInfo error ? ', error)
  }
}

export const getRoyalty = (contractType: string, address: string, chainId: number, signer: any) => async (dispatch: Dispatch<any>) => {
  try {
    if (contractType === 'ERC721') {
      const NFTContract = getERC721Instance(address, chainId, null)
      // const supportedERP2981 = await NFTContract.supportsInterface(ERC2189_INTERFACE_ID)
      // if(supportedERP2981){
      // 	const royalty = await NFTContract.royaltyInfo(1,100)
      // 	setRoyalty(parseInt(royalty[1])/100.0)
      // }
      // else{
      // 	const RoyaltyManager = getRoyaltyFeeMangerInstance(RoyaltyFeeManagerAddress[chainId], chainId)
      // 	const royaltyInfo = await RoyaltyManager.calculateRoyaltyFeeAndGetRecipient(address,1,100)
      // 	setRoyalty(parseInt(royaltyInfo[1])/100.0)

      // }
      try {
        const royalty = await NFTContract.royaltyInfo(1, 100)
        dispatch(setRoyalty(parseInt(royalty[1])))
      } catch (error) {
        const RoyaltyManager = getRoyaltyFeeMangerInstance(RoyaltyFeeManagerAddress[chainId], chainId)
        const royaltyInfo = await RoyaltyManager.calculateRoyaltyFeeAndGetRecipient(address, 1, 100)
        dispatch(setRoyalty(parseInt(royaltyInfo[1])))
      }
    } else if (contractType === 'ERC1155') {
      const NFTContract = getERC1155Instance(address, chainId, null)

      //const supportedERP2981 = await NFTContract.supportsInterface(ERC2189_INTERFACE_ID)
      // if(supportedERP2981){
      // 	const royalty = await NFTContract.royaltyInfo(1,100)
      // 	setRoyalty(parseInt(royalty[1])/100.0)
      // }
      // else{
      // 	const RoyaltyManager = getRoyaltyFeeMangerInstance(RoyaltyFeeManagerAddress[chainId], chainId)
      // 	const royaltyInfo = await RoyaltyManager.calculateRoyaltyFeeAndGetRecipient(address,1,100)
      // 	setRoyalty(parseInt(royaltyInfo[1])/100.0)

      // }
      try {
        const royalty = await NFTContract.royaltyInfo(1, 100)
        dispatch(setRoyalty(parseInt(royalty[1])))
      } catch (error) {
        const RoyaltyManager = getRoyaltyFeeMangerInstance(RoyaltyFeeManagerAddress[chainId], chainId)
        const royaltyInfo = await RoyaltyManager.calculateRoyaltyFeeAndGetRecipient(address, 1, 100)
        dispatch(setRoyalty(parseInt(royaltyInfo[1])))
      }
    } else {
      console.log('Invalid contract type')
    }
  } catch (error) {
    console.log(error)
  }
}

export const getCollectionsForComingAndLive = () => async (dispatch: Dispatch<any>, getState: () => any) => {
  const collections = getState().collectionsState.collections
  const collectionsForLive = collections.filter((collection: { mint_status: string }) => collection.mint_status === 'Live')
  const collectinosForComing = collections.filter((collection: { mint_status: string }) => collection.mint_status === 'Upcoming')
  if (collectionsForLive.length > 0) {
    let resCollectionsForLive: any[] = []
    for (const collection of collectionsForLive) {
      let totalCnt = 0
      const collectionAdr = Array.from(Object.keys(collection.address))
      for (const key of collectionAdr) {
        if (isSupportedOnAlchemy(parseInt(key))) {
          const settings = {
            apiKey: getAPIkeyForAlchemy(parseInt(key)), // Replace with your Alchemy API Key.
            network: getNetworForAlchemy(parseInt(key)), // Replace with your network.
          }
          const alchemy = new Alchemy(settings)

          const resp = await alchemy.nft.getNftsForContract(collection.address[key])
          if (resp?.nfts) {
            totalCnt += resp.nfts.length
          }

        }
        if (isSupportedOnMoralis(parseInt(key))) {
          const options = {
            method: 'GET',
            url: `https://deep-index.moralis.io/api/v2/nft/${collection.address[key]}`,
            params: {chain: getChainNameFromId(parseInt(key)), format: 'decimal'},
            headers: {
              accept: 'application/json',
              'X-API-Key': 'leaSlfD5P1cgV4T1h72OfbaYRF4oYlEqdlXkmKUc9456mKeK8JrghLHNB2NIc8oN'
            }
          }
          const resp = await axios.request(options)
          if (resp.data.total > 0) {
            totalCnt += resp.data.total
          }
        }
      }

      const data = JSON.parse(JSON.stringify(collection))

      const newCollection = Object.assign({totalCnt: totalCnt}, data)
      resCollectionsForLive = [...resCollectionsForLive, newCollection]
    }
    localStorage.setItem('NftLive', JSON.stringify(resCollectionsForLive))
    dispatch(setCollectionsForLive(resCollectionsForLive))
  }
  if (collectinosForComing.length > 0) {
    const resCollectionsForComing: any[] = []
    for (const collection of collectinosForComing) {
      let totalCnt = 0
      const collectionAdr = Array.from(Object.keys(collection.address))
      for (const key of collectionAdr) {
        if (isSupportedOnAlchemy(parseInt(key))) {
          const settings = {
            apiKey: getAPIkeyForAlchemy(parseInt(key)), // Replace with your Alchemy API Key.
            network: getNetworForAlchemy(parseInt(key)), // Replace with your network.
          }
          const alchemy = new Alchemy(settings)

          const resp = await alchemy.nft.getNftsForContract(collection.address[key])
          if (resp?.nfts) {
            totalCnt += resp.nfts.length
          }
        }
        if (isSupportedOnMoralis(parseInt(key))) {
          const options = {
            method: 'GET',
            url: `https://deep-index.moralis.io/api/v2/nft/${collection.address[key]}`,
            params: {chain: getChainNameFromId(parseInt(key)), format: 'decimal'},
            headers: {
              accept: 'application/json',
              'X-API-Key': 'leaSlfD5P1cgV4T1h72OfbaYRF4oYlEqdlXkmKUc9456mKeK8JrghLHNB2NIc8oN'
            }
          }
          const resp = await axios.request(options)
          if (resp.data.total > 0) {
            totalCnt += resp.data.total
          }


        }
      }
      const data = JSON.parse(JSON.stringify(collection))
      const newCollection = Object.assign({totalCnt: totalCnt}, data)
      resCollectionsForComing.push(newCollection)
    }
    localStorage.setItem('NftComing', JSON.stringify(resCollectionsForComing))
    dispatch(setCollectionsForComing(resCollectionsForComing))
  }
}

//selectors
export const selectCollectionNFTs = (state: any) => state.collectionsState.nfts
export const selectCollectionInfo = (state: any) => state.collectionsState.info
export const selectNFTInfo = (state: any) => state.collectionsState.nftInfo
export const selectGetNFTs = (state: any) => state.collectionsState.finishedGetting
export const selectCollectionOwners = (state: any) => state.collectionsState.owners
export const selectCollections = (state: any) => state.collectionsState.collections
export const selectCollectionAllNFTs = (state: any) => state.collectionsState.allNFTs
export const selectCollectionsForCard = (state: any) => state.collectionsState.collectionsForCard
export const selectRoyalty = (state: any) => state.collectionsState.royalty
export const selectCollectionsForComing = (state: any) => state.collectionsState.collectinosForComing
export const selectCollectionsForLive = (state: any) => state.collectionsState.collectionsForLive

export default collectionsSlice.reducer
