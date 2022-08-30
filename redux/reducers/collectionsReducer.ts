import { createSlice } from '@reduxjs/toolkit'
import { Dispatch } from 'react'
import { useSelector } from 'react-redux'
import { IGetOrderRequest } from '../../interface/interface'
import { collectionsService } from '../../services/collections'
import { getOrders } from './ordersReducer'
import { openSnackBar } from './snackBarReducer'
interface CollectionState{
	nfts:any[],
	info:{},
	nftInfo:{},
	finishedGetting:boolean,
	owners:number,
	collections:any[],
	collectionsForCard:any[]
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
		collectionsForCard:[]
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
			console.log(action.payload)
			state.collectionsForCard = action.payload === undefined ? '' : action.payload
		}
	}
})

//actions
export const { setCollectionNFTs, setCollectionAllNFTs,setCollectionInfo, setNFTInfo, clearCollections, startGetNFTs, setCollectionOwners, setCollections } = collectionsSlice.actions

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
			status: ['VALID'],
			sort: 'PRICE_ASC'
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
						const items = await collectionsService.getCollectionInfo(element.col_url as string)
						setTimeout(async function(){
							orders.map((element:any)=>{
								console.log(element.collectionAddress, items.data.address )
								if(element.collectionAddress===items.data.address){
									orderCnt++
								}
							})
							console.log(orderCnt)
							collectionsF.push({col_url:element.col_url, itemsCnt:items.data.count, ownerCnt:ownerCnt.data, orderCnt:orderCnt})		
							if(collectionsF.length===info.data.length){
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

//selectors
export const selectCollectionNFTs = (state: any) => state.collectionsState.nfts
export const selectCollectionInfo = (state: any) => state.collectionsState.info
export const selectNFTInfo = (state: any) => state.collectionsState.nftInfo
export const selectGetNFTs = (state: any) => state.collectionsState.finishedGetting
export const selectCollectionOwners = (state: any) => state.collectionsState.owners
export const selectCollections = (state: any) => state.collectionsState.collections
export const selectCollectionAllNFTs = (state: any) => state.collectionsState.allNFTs
export const selectCollectionsForCard = (state: any) => state.collectionsState.collectionsForCard

export default collectionsSlice.reducer