import { IGetOrderRequest,IAcceptOrderRequest } from '../interface/interface'
import { MakerOrderWithSignature } from '../types'
import API from './api'

const createOrder = async (data: MakerOrderWithSignature) => {
  const res = await API.post('orders', data)
  return res.data.data
}

const acceptOrder = async (request: IAcceptOrderRequest) => {
  const res = await API.post('orders/changeOrderStatus', {
    params: request
  })
  return res.data
}

export const orderService = {
  createOrder,
  acceptOrder
}
