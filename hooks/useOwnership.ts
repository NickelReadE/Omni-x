import {useEffect, useState} from 'react'
import {userService} from '../services/users'

export type OwnershipFunction = {
  owner?: string,
  ownerType?: string,
}

const getUserInformation = async (owner: string) => {
  const user_info = await userService.getUserByAddress(owner)
  if (user_info.username == '') {
    return {
      owner: owner as string,
      ownerType: 'address',
    }
  } else {
    return {
      owner: user_info.username as string,
      ownerType: 'username',
    }
  }
}

const useOwnership = ({
  owner_address,
}: any): OwnershipFunction => {
  const [ownership, setOwnership] = useState({
    owner: '',
    ownerType: '',
  })
  useEffect(() => {
    getUserInformation(owner_address).then(data => {
      setOwnership(data)
    })
  }, [owner_address])

  return ownership
}

export default useOwnership
