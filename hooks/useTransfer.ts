
export type TradingInput = {
    collectionUrl?: string,  // col_url
}

type TransferFunction = {
  collectionUrl?: string,  // col_url
}

export const useTransfer = (data: TradingInput): TransferFunction => {
  const collectionUrl = data.collectionUrl

  return {
    collectionUrl
  }
}

export default useTransfer