import API from './api'

const getCollectionNFTs = async (col_url: string, page: number, display_per_page: number, sort: string, searchObj: any, chainIds: number[]) => {
  const option = {
    col_url,
    page,
    display_per_page,
    sort,
    searchObj,
    chainIds,
  }
  return await API.post('collections/nfts', option)
}

const updateCollectionNFTSalePrice = async (col_url: string, token_id: number, price: number) => {
  const option = {
    col_url,
    token_id,
    price
  }
  return await API.post('collections/nfts/updateSalePrice', option)
}

const updateCollectionNFTChainID = async (col_url: string, token_id: number, chain_id: number) => {
  const option = {
    col_url,
    token_id,
    chain_id
  }
  return await API.post('collections/nfts/updateChainID', option)
}

const getCollectionAllNFTs = async (col_url: string, sort: string, searchObj: any) => {
  const option = {
    col_url,
    sort,
    searchObj
  }
  return await API.post('collections/allNfts', option)
}

const getFeaturedCollections = async () => {
  return await API.get('collections/featured')
}
const getTopCollections = async (selectedChainIds: number[], dayRange: number) => {
  return await API.post('collections/top', {
    chainIds: selectedChainIds,
    dayRange,
  })
}

const getCollectionInfo = async (col_url: string) => {
  return await API.get(`collections/${col_url}`)
}

const getNFTInfo = async (col_url: string, token_id: string) => {
  return await API.get(`collections/${col_url}/${token_id}`)
}

const getCollections = async () => {
  return await API.get('collections')
}

const getCollectionsWithoutMetadata = async () => {
  return await API.get('collections/compact')
}

const refreshMetadata = async (col_url: string, token_id: string) => {
  return await API.post('collections/refresh_metadata', {
    col_url,
    token_id,
  })
}

export const collectionsService = {
  getCollectionNFTs,
  getCollectionInfo,
  getNFTInfo,
  getCollections,
  getCollectionsWithoutMetadata,
  refreshMetadata,
  getCollectionAllNFTs,
  updateCollectionNFTSalePrice,
  updateCollectionNFTChainID,
  getFeaturedCollections,
  getTopCollections,
}
