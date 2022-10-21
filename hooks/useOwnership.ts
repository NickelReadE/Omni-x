import {useEffect, useState} from 'react'
import {userService} from '../services/users'
import { getProfileLink } from '../utils/constants'
import useWallet from './useWallet'

export type OwnershipFunction = {
  owner?: string,
  profileLink?: string,
}

const getUserInformation = async (owner: string, chain_id: number) => {
  const user_info = await userService.getUserByAddress(owner)
  const profileLink = getProfileLink(chain_id, owner)
  if (user_info.username == '') {
    return {
      owner: owner as string,
      profileLink: profileLink
    }
  } else {
    return {
      owner: user_info.username as string,
      profileLink: profileLink
    }
  }
}

const useOwnership = ({
  owner_address,
}: any): OwnershipFunction => {
  const { chainId } = useWallet()
  const [ownership, setOwnership] = useState({
    owner: '',
    profileLink: '',
  })
  useEffect(() => {
    if (chainId) {
      getUserInformation(owner_address, chainId).then(data => {
        setOwnership(data)
      })
    }
  }, [owner_address, chainId])

  return ownership
}

export default useOwnership
