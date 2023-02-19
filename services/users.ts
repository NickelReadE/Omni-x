import API from './api'

const updateProfile = async (profile: FormData) => {
  const res = await API.post('users/update-profile', profile)
  return res.data
}

const updateProfileImage = async (address: string, image_link: string) => {
  return await API.post('users/update-profile-image', {
    address: address.toLowerCase(),
    image: image_link
  })
}

const getUserByAddress = async (address: string) => {
  const res = await API.get(`users/profile/${address.toLowerCase()}`)
  return res.data
}

const searchByKeyword = async (keyword: string) => {
  const res = await API.get(`users/search/${keyword}`)
  return res.data
}

const getUserNFTs = async (address: string) => {
  const res = await API.get(`users/nfts/${address.toLowerCase()}`)
  return res.data
}

const getActivity = async (address: string) => {
  const res = await API.get(`users/activity/${address.toLowerCase()}`)
  return res.data
}

const getUserCollections = async (address: string) => {
  const { data } = await API.get(`users/collections/${address.toLowerCase()}`)
  return data
}

const getUserNonce = async (address: string) => {
  const { data } = await API.get(`users/get-nonce/${address.toLowerCase()}`)
  return data.nonce
}

const addFavoriteCollection = async (address: string, col_url: string) => {
  const { data } = await API.post(`users/fav-collections/${address.toLowerCase()}/add`, {
    col_url: col_url,
  })
  return data
}

const removeFavoriteCollection = async (address: string, col_url: string) => {
  const { data } = await API.post(`users/fav-collections/${address.toLowerCase()}/remove`, {
    col_url: col_url,
  })
  return data
}

const getFavoriteCollections = async (address: string) => {
  const { data } = await API.get(`users/fav-collections/${address.toLowerCase()}`)
  return data
}

const addFavorite = async (address: string, col_url: string, token_id: string) => {
  const { data } = await API.post(`users/items/${address.toLowerCase()}/add`, {
    col_url: col_url,
    token_id: token_id
  })
  return data
}

const removeFavorite = async (address: string, col_url: string, token_id: string) => {
  const { data } = await API.post(`users/items/${address.toLowerCase()}/remove`, {
    col_url: col_url,
    token_id: token_id
  })
  return data
}

const getFavoriteItems = async (address: string) => {
  const { data } = await API.get(`users/items/${address.toLowerCase()}`)
  return data
}

const addHideItem = async (address: string, col_url: string, token_id: string) => {
  const { data } = await API.post(`users/hidden/${address.toLowerCase()}/add`, {
    col_url: col_url,
    token_id: token_id
  })
  return data
}

const removeHideItem = async (address: string, col_url: string, token_id: string) => {
  const { data } = await API.post(`users/hidden/${address.toLowerCase()}/remove`, {
    col_url: col_url,
    token_id: token_id
  })
  return data
}

const getHideItems = async (address: string) => {
  const { data } = await API.get(`users/hidden/${address.toLowerCase()}`)
  return data
}


export const userService = {
  updateProfile,
  updateProfileImage,
  getUserByAddress,
  searchByKeyword,
  getUserNFTs,
  getActivity,
  getUserNonce,
  getUserCollections,
  addFavoriteCollection,
  removeFavoriteCollection,
  addHideItem,
  removeHideItem,
  getHideItems,
  addFavorite,
  removeFavorite,
  getFavoriteItems,
  getFavoriteCollections
}
