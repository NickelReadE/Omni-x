import React from 'react'
import {ActivityType} from '../../hooks/useActivities'
import {chainInfos, USER_ACTIVITY_TYPE_NAMES} from '../../utils/constants'
import {truncateAddress} from '../../utils/utils'
import {ChainIds, USER_ACTIVITY_TYPE} from '../../types/enum'

const UserActivity = ({ activities }: { activities: ActivityType[] }) => {
  return (
    <>
      <div className="w-full">
        <div>
          {
            activities.map((activity, index) => {
              return (
                <div key={index} className="flex items-center justify-between mt-4">
                  <div className="flex flex-1 items-center rounded-lg">
                    <img src={activity.tokenData?.image} width={50} height={50} alt={'token Image'} />
                    <div className={'flex flex-col ml-2'}>
                      <span>{activity.tokenData?.name}</span>
                      <span>{activity.tokenId}</span>
                    </div>
                  </div>

                  <div className={'flex flex-1'}>{USER_ACTIVITY_TYPE_NAMES[activity.activity]}</div>

                  <div className={'flex flex-1 items-center'}>
                    {
                      activity.srcChainId && activity.activity === USER_ACTIVITY_TYPE.Send &&
                      <img key={index} alt={'networkIcon'} src={chainInfos[activity.srcChainId].logo || chainInfos[ChainIds.ETHEREUM].logo} className="mr-2 h-[20px]" />
                    }
                    {
                      activity.activity === USER_ACTIVITY_TYPE.Transfer &&
                      <img key={index} alt={'networkIcon'} src={chainInfos[activity.chainId].logo || chainInfos[ChainIds.ETHEREUM].logo} className="mr-2 h-[20px]" />
                    }
                    {truncateAddress(activity.from)}
                  </div>
                  <div className={'flex flex-1 items-center'}>
                    <img key={index} alt={'networkIcon'} src={chainInfos[activity.chainId].logo || chainInfos[ChainIds.ETHEREUM].logo} className="mr-2 h-[20px]" />
                    {truncateAddress(activity.to)}
                  </div>
                  <div className={'flex flex-1'}>{new Date(activity.createdAt).toLocaleString()}</div>
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  )
}

export default UserActivity
