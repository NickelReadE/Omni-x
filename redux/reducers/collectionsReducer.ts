import {createSlice} from '@reduxjs/toolkit'
import {Dispatch} from 'react'
import {collectionsService} from '../../services/collections'
import {getERC721Instance, getERC1155Instance, getRoyaltyFeeMangerInstance} from '../../utils/contracts'
import {RoyaltyFeeManagerAddress} from '../../utils/constants/addresses'

interface CollectionState {
  nfts: any[],
  allNFTs: any,
  info: null,
  nftInfo: any,
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
    setCollectionInfo: (state, action) => {
      state.info = action.payload === undefined ? {} : action.payload.data
    },
    setRoyalty: (state, action) => {
      state.royalty = action.payload === undefined ? '' : action.payload
    },
  }
})

//actions
export const {
  setCollectionInfo,
  setRoyalty,
} = collectionsSlice.actions

export const getCollectionInfo = (col_url: string) => async (dispatch: Dispatch<any>) => {
  try {
    const info = await collectionsService.getCollectionInfo(col_url)
    dispatch(setCollectionInfo(info))
  } catch (error) {
    console.log('getCollectionInfo error ? ', error)
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

//selectors
export const selectCollectionInfo = (state: any) => state.collectionsState.info
export const selectRoyalty = (state: any) => state.collectionsState.royalty

export default collectionsSlice.reducer
