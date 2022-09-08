import { createSlice } from '@reduxjs/toolkit'
import { Dispatch } from 'react'
import { useSelector } from 'react-redux'
import { IGetOrderRequest } from '../../interface/interface'
import { collectionsService } from '../../services/collections'
import { getOrders } from './ordersReducer'
import { openSnackBar } from './snackBarReducer'
import { getERC721Instance, getERC1155Instance, getRoyaltyFeeMangerInstance } from '../../utils/contracts'
import { ERC2189_INTERFACE_ID } from '../../utils/constants'
import { RoyaltyFeeManagerAddress } from '../../constants/addresses'

import { ethers } from 'ethers'
interface CollectionState{
	nfts:any[],
	allNFTs: {},
	info:{},
	nftInfo:{},
	finishedGetting:boolean,
	owners:number,
	collections:any[],
	collectionsForCard:any[],
	royalty:number
}
//reducers
export const collectionsSlice = createSlice({
	name: 'collections',
	initialState: {
		nfts: [],
		allNFTs: {},
		info: {},
		nftInfo: {},
		finishedGetting: false,
		owners: 0,
		collections: [],
		collectionsForCard:[],
		royalty: 0
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
		setCollectionsForCard:(state, action)=>{
			state.collectionsForCard = action.payload === undefined ? '' : action.payload
		},
		setRoyalty: (state, action) =>{
			console.log('reduce',action.payload)
			state.royalty = action.payload === undefined ? '' : action.payload
		}
	}
})

//actions
export const { setCollectionNFTs,setCollectionAllNFTs, setCollectionInfo, setNFTInfo, clearCollections, startGetNFTs, setCollectionOwners, setCollections, setCollectionsForCard, setRoyalty } = collectionsSlice.actions

export const clearCollectionNFTs = () => (dispatch: Dispatch<any>) => {
	dispatch(clearCollections())
}

export const getCollectionNFTs = (col_url: string, page: Number, display_per_page: Number, sort: String, searchObj: Object) => async (dispatch: Dispatch<any>) => {
	dispatch(startGetNFTs())
	try {
		const nfts = await collectionsService.getCollectionNFTs(col_url, page, display_per_page, sort, searchObj)
		dispatch(setCollectionNFTs(nfts))
	} catch (error) {
		console.log("getCollectionNFTs error ? ", error)
	}
}

export const getCollectionAllNFTs = (col_url: string,sort: String, searchObj: Object) => async (dispatch: Dispatch<any>) => {
	dispatch(startGetNFTs())
	try {
		const nfts = await collectionsService.getCollectionAllNFTs(col_url, sort, searchObj)
		dispatch(setCollectionAllNFTs(nfts))
	} catch (error) {
		console.log("getCollectionAllNFTs error ? ", error)
	}
}

export const getCollectionInfo = (col_url: string) => async (dispatch: Dispatch<any>) => {
	try {
		const info = await collectionsService.getCollectionInfo( col_url )
		dispatch(setCollectionInfo(info))
	} catch (error) {
		console.log("getCollectionInfo error ? ", error)
	}
}

export const getCollectionOwners = (col_url: string) => async (dispatch: Dispatch<any>) => {
	try {
		const info = await collectionsService.getCollectionOwners(col_url)
		dispatch(setCollectionOwners(info))
	} catch (error) {
		console.log("getCollectionInfo error ? ", error)
	}
}

export const getNFTInfo = (col_url: string, token_id: string) => async (dispatch: Dispatch<any>) => {
	try {
		const info = await collectionsService.getNFTInfo(col_url, token_id)
		dispatch(setNFTInfo(info))
	} catch (error) {
		console.log("getNFTInfo error ? ", error)
	}
}

export const getCollections = () => async (dispatch: Dispatch<any>) => {
	try {
		const info = await collectionsService.getCollections()
		dispatch(setCollections(info))
	} catch (error) {
		console.log("getNFTInfo error ? ", error)
	}
}

export const updateCollectionsForCard = () => async (dispatch: Dispatch<any>, getState: () => any) => {
	try {
		const request: IGetOrderRequest = {
			isOrderAsk: true,
			startTime: Math.floor(Date.now() / 1000).toString(),
			endTime: Math.floor(Date.now() / 1000).toString(),
			status: ['VALID'],
			sort: 'OLDEST'
		}
	  	await dispatch(getOrders(request))
		const orders = getState().ordersState.orders
		let collectionsF : any[] = []
		const info = await collectionsService.getCollections()		
		await info.data.map(async (element:any, index:number)=>{
			setTimeout(async function(){
				const ownerCnt = await collectionsService.getCollectionOwners(element.col_url as string)
				setTimeout(
					async function(){				
						let orderCnt = 0	
						const nfts = await collectionsService.getCollectionAllNFTs(element.col_url as string , '', '')
						const collectionInfo  = await collectionsService.getCollectionInfo(element.col_url as string)
						setTimeout(async function(){
							nfts.data.map((nft:any)=>{
								for(const order of orders){
									if(collectionInfo.data.address==order.collectionAddress&& nft.token_id==order.tokenId && order.isOrderAsk){
										orderCnt++
										break										
									}
								}								
								
							})
							collectionsF.push({col_url:element.col_url, itemsCnt:collectionInfo.data.count, ownerCnt:ownerCnt.data, orderCnt:orderCnt})		
							if(collectionsF.length===info.data.length){
								localStorage.setItem('cards',JSON.stringify(collectionsF))
								dispatch(setCollectionsForCard(collectionsF))			
							}
						},2000*index)
					}
					,1000*index)
			},1000*index)
		})
				
	} catch (error) {
		console.log("updateCollectionsForCard error ? ", error)
	}
}

export const getRoyalty = (contractType:string, address: string, chainId:number, signer:any) => async (dispatch: Dispatch<any>) => {
	try{
		if(contractType==='ERC721'){
			const NFTContract =  getERC721Instance(address,chainId,null)
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
			try{
				const royalty = await NFTContract.royaltyInfo(1,100)
				dispatch(setRoyalty(parseInt(royalty[1])))
			}catch(error){
				const RoyaltyManager = getRoyaltyFeeMangerInstance(RoyaltyFeeManagerAddress[chainId], chainId)
				const royaltyInfo = await RoyaltyManager.calculateRoyaltyFeeAndGetRecipient(address,1,100)
				dispatch(setRoyalty(parseInt(royaltyInfo[1])))
			}
		}else if(contractType==='ERC1155'){
			const NFTContract =  getERC1155Instance(address,chainId,null)
			
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
			console.log('NFT1155',NFTContract)
			try{
				const royalty = await NFTContract.royaltyInfo(1,100)
				dispatch(setRoyalty(parseInt(royalty[1])))
			}catch(error){
				const RoyaltyManager = getRoyaltyFeeMangerInstance(RoyaltyFeeManagerAddress[chainId], chainId)
				const royaltyInfo = await RoyaltyManager.calculateRoyaltyFeeAndGetRecipient(address,1,100)
				dispatch(setRoyalty(parseInt(royaltyInfo[1])))
			}
		}else{
			console.log("Invalid contract type")
		}
	}catch(error){
		console.log(error)
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

export default collectionsSlice.reducer