import { useEffect, useState } from 'react'
import { NFTItem } from '../interface/interface'
import { userService } from '../services/users'

export type ProfileData = {
  address: string,
  username: string,
  bio?: string,
  twitter?: string,
  website?: string,
  avatar: string,
  banners?: string[],
  isGregHolder: boolean,
}

export type UserInformation = {
  profile: ProfileData | undefined,
  nfts: Array<NFTItem>,
  refreshNfts: () => Promise<void>
}

const getUserInformation = async (user_address: string): Promise<ProfileData | undefined> => {
  const user_info = await userService.getUserByAddress(user_address)
  if (user_info) {
    return {
      address: user_address,
      username: user_info.username,
      bio: user_info.bio,
      twitter: user_info.twitter,
      website: user_info.website,
      avatar: user_info.avatar,
      banners: user_info.banners,
      isGregHolder: user_info.isGregHolder,
    }
  }
  return undefined
}

const getUserNFTs = async (address: string): Promise<Array<NFTItem>> => {
  try {
    const nfts = await userService.getUserNFTs(address)
    return nfts
  } catch (err: any) {
    console.error(err)
    return []
  }
}

const useProfile = (
  user_address: string | undefined,
): UserInformation => {
  const [profile, setProfile] = useState<ProfileData | undefined>()
  const [nfts, setNfts] = useState<Array<NFTItem>>([])

  useEffect(() => {
    (async () => {
      if (user_address) {
        setProfile(await getUserInformation(user_address))
        setNfts(await getUserNFTs(user_address))
      }
    })()
  }, [user_address])

  const refreshNfts = async () => {
    if (user_address) {
      setNfts(await getUserNFTs(user_address))
    }
  }

  return {
    profile,
    nfts,
    refreshNfts,
  }
}

export default useProfile
