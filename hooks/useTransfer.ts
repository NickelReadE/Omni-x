import {NFTItem} from '../interface/interface'

export type ITransferProps = {
    collectionUrl?: string,
  nftItem: NFTItem,
}

type TransferFunction = {
  collectionUrl?: string,  // col_url
}

export const useTransfer = (data: ITransferProps): TransferFunction => {
  const collectionUrl = data.collectionUrl

  return {
    collectionUrl
  }
}

export default useTransfer