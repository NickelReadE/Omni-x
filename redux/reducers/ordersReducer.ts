import { createSlice } from '@reduxjs/toolkit'
import { Dispatch } from 'react'
import { IGetOrderRequest } from '../../interface/interface'
import { orderService } from '../../services/orders'
import { MakerOrderWithSignature } from '../../types'
import { openSnackBar } from './snackBarReducer'

//reducers
export const ordersSlice = createSlice({
	name: 'orders',
	initialState: {
		orders: [],
		bidOrders: [],
	},
	reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload === undefined ? {} : action.payload.data
        },
		setBidOrders: (state, action) => {
            state.bidOrders = action.payload === undefined ? {} : action.payload.data
        },
	}
})

//actions
export const { setOrders } = ordersSlice.actions
export const { setBidOrders } = ordersSlice.actions


export const getOrders = (request: IGetOrderRequest) => async (dispatch: Dispatch<any>) => {
	try {
        const orders = await orderService.getOrders(request)
		if(request.isOrderAsk){
			dispatch(setOrders(orders))
		} else {
			dispatch(setBidOrders(orders))
		}
	} catch (error) {
		console.log("getOrders error ? ", error)
	}
}


export const createOrder = (data: MakerOrderWithSignature) => async (dispatch: Dispatch<any>) => {
	try {
        const resp = await orderService.createOrder(data)
	} catch (error) {
		console.log("createOrder error ? ", error)
	}
}

//selectors
export const selectOrders = (state: any) => state.ordersState.orders
export const selectBidOrders = (state: any) => state.ordersState.bidOrders

export default ordersSlice.reducer