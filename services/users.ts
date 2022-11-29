import API from './api'

const updateProfile = async (profile: FormData) => {
  const res = await API.post('users/profile', profile)
  return res.data.data
}

const updateProfileImage = async (address: string, image_link: string) => {
  const res = await API.post('users/update_profile_image', {
    address: address,
    image: image_link
  })
  return res.data
}

const getUserByAddress = async (address: string) => {
  const res = await API.get(`users/profile/${address}`)
  return res.data.data
}

const searchByKeyword = async (keyword: string) => {
  const res = await API.get(`users/search/${keyword}`)
  return res.data.data
}

const getUserNFTs = async (address: string) => {
  const res = await API.get(`users/nfts/${address}`)
  return res.data.data
}

const getActivity = async (address: string) => {
  const res = await API.get(`users/activity/${address}`)
  return res.data.data
}

const getUserNonce = async (address: string) => {
  const res = await API.get(`users/getUserNonce/${address}`)
  return res.data.data
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
