import API from './api'

const updateProfile = async (profile: FormData) => {
  const res = await API.post('users/profile', profile)
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

const getUserNonce = async (address: string) => {
  const res = await API.get(`users/getUserNonce/${address.toLowerCase()}`)
  return res.data
}

export const userService = {
  updateProfile,
  updateProfileImage,
  getUserByAddress,
  searchByKeyword,
  getUserNFTs,
  getActivity,
  getUserNonce
}
