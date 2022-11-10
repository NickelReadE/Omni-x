import {useEffect, useState} from 'react'
import {userService} from '../services/users'
import {USER_ACTIVITY_TYPE} from '../types/enum'

export type ActivityType = {
  activity: USER_ACTIVITY_TYPE,
  col_url?: string,
  from: string,
  to: string,
  tokenId: string,
  srcChainId: number,
  chainId: number,
  createdAt: string,
  senderTransactionHash: string,
  transactionHash: string,
  tokenData?: any,
}

export type ActivitiesTypeFunc = {
    activities: ActivityType[],
    refreshActivities: () => void
}

const getActivities = async (address: string) => {
  return await userService.getActivity(address)
}

const useActivities = (address: string | undefined): ActivitiesTypeFunc => {
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [refresh, setRefresh] = useState<boolean>(false)

  const refreshActivities = () => {
    setRefresh(!refresh)
  }

  useEffect(() => {
    (async () => {
      if (address) {
        setActivities(await getActivities(address))
      }
    })()
  }, [address, refresh])

  return {
    activities,
    refreshActivities
  }
}

export default useActivities
