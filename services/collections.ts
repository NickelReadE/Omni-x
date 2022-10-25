import API from './api'

const getCollectionNFTs = async (col_url: string, page: number, display_per_page: number, sort: string, searchObj: any) => {
  const option = {
    col_url,
    page,
    display_per_page,
    sort,
    searchObj
  }
  const res = await API.post('collections/nfts', option)
  return res.data
}

const updateCollectionNFTSalePrice = async (col_url: string, token_id: number, price: number) => {
  const option = {
    col_url,
    token_id,
    price
  }
  const res = await API.post('collections/nfts/updateSalePrice', option)
  return res.data
}

const updateCollectionNFTChainID = async (col_url: string, token_id: number, chain_id: number) => {
  const option = {
    col_url,
    token_id,
    chain_id
  }
  const res = await API.post('collections/nfts/updateChainID', option)
  return res.data
}

const getCollectionAllNFTs = async (col_url: string, sort: string, searchObj: any) => {
  const option = {
    col_url,
    sort,
    searchObj
  }
  const res = await API.post('collections/allNfts', option)
  return res.data
}


const getCollectionInfo = async (col_url: string) => {
  const res = await API.get(`collections/${col_url}`)
  return res.data
}

const getCollectionOwners = async (chain: string, address: string) => {
  const res = await API.post(`collections/${chain}/${address}`)
  return res.data
}

const getNFTInfo = async (col_url: string, token_id: string) => {
  const res = await API.get(`collections/${col_url}/${token_id}`)
  return res.data
}

const getCollections = async () => {
  const res = await API.get('collections/all')
  return res.data
}

const getNFTOwner = async (col_address: string, collection_chain_name: string, token_id: string) => {
  const res = await API.get(`collections/owner/${col_address}/${collection_chain_name}/${token_id}`)
  return res.data.owner
}

export const collectionsService = {
  getCollectionNFTs,
  getCollectionInfo,
  getCollectionOwners,
  getNFTInfo,
  getCollections,
  getNFTOwner,
  getCollectionAllNFTs,
  updateCollectionNFTSalePrice,
  updateCollectionNFTChainID,
}
