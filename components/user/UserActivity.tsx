import React, {useMemo, useState} from 'react'
import Link from 'next/link'
import {ActivityType} from '../../hooks/useActivities'
import {getBlockExplorer, getChainIcons, USER_ACTIVITY_TYPE_NAMES} from '../../utils/constants'
import {truncateAddress} from '../../utils/utils'
import {USER_ACTIVITY_TYPE} from '../../types/enum'

const ActivitySend = ({activity}: {activity: ActivityType}) => {
  const [hovered, setHovered] = useState(false)
  const [targetHovered, setTargetHovered] = useState(false)

  const sendTransactionHashLink = useMemo(() => {
    return getBlockExplorer(activity.srcChainId) + '/tx/' + activity.senderTransactionHash
  }, [activity.srcChainId, activity.senderTransactionHash])

  const receiveTransactionHashLink = useMemo(() => {
    if (activity.transactionHash) {
      return getBlockExplorer(activity.chainId) + '/tx/' + activity.transactionHash
    }
    return undefined
  }, [activity.chainId, activity.transactionHash])

  const senderChainIcon = useMemo(() => {
    return getChainIcons(activity.srcChainId)
  }, [activity.srcChainId])

  const receiverChainIcon = useMemo(() => {
    return getChainIcons(activity.chainId)
  }, [activity.chainId])

  const onHover = (type: 'sender' | 'target') => {
    if (type === 'sender' && activity.senderTransactionHash) {
      setHovered(true)
    } else if (type === 'target' && activity.transactionHash) {
      setTargetHovered(true)
    }
  }

  const onLeave = (type: 'sender' | 'target') => {
    if (type === 'sender') {
      setHovered(false)
    } else {
      setTargetHovered(false)
    }
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <Link href={`/collections/${activity.col_url}/${activity.tokenId}`}>
        <div className="flex flex-1 items-center rounded-lg cursor-pointer">
          <img src={activity.tokenData?.image} width={50} height={50} alt={'token Image'} />
          <div className={'flex flex-col ml-2'}>
            <span>{activity.tokenData?.name}</span>
            <span>{activity.tokenId}</span>
          </div>
        </div>
      </Link>

      <div className={'flex flex-1'}>{USER_ACTIVITY_TYPE_NAMES[activity.activity]}</div>

      <div className={'flex flex-1 items-center'}>
        {
          activity.srcChainId && activity.activity === USER_ACTIVITY_TYPE.Send &&
          <img
            alt={'networkIcon'}
            src={(hovered) ? senderChainIcon.explorer : senderChainIcon.icon}
            onMouseEnter={() => onHover('sender')}
            onMouseLeave={() => onLeave('sender')}
            onClick={() => {
              if (activity.senderTransactionHash) window.open(sendTransactionHashLink, '_blank')
            }}
            className={`mr-2 h-[20px] ${activity.senderTransactionHash ? 'cursor-pointer opacity-1' : 'opacity-40'}`}
          />
        }
        {
          activity.activity === USER_ACTIVITY_TYPE.Transfer &&
          <img
            alt={'networkIcon'}
            src={(hovered) ? senderChainIcon.explorer : senderChainIcon.icon}
            onMouseEnter={() => onHover('sender')}
            onMouseLeave={() => onLeave('sender')}
            onClick={() => {
              if (activity.senderTransactionHash) window.open(sendTransactionHashLink, '_blank')
            }}
            className={`mr-2 h-[20px] ${activity.senderTransactionHash ? 'cursor-pointer opacity-1' : 'opacity-40'}`}
          />
        }
        {
          activity.activity === USER_ACTIVITY_TYPE.Sell &&
          <img
            alt={'networkIcon'}
            src={senderChainIcon.icon}
            className={'mr-2 h-[20px]'}
          />
        }
        {truncateAddress(activity.from)}
      </div>
      <div className={'flex flex-1 items-center'}>
        <img
          alt={'networkIcon'}
          src={(targetHovered) ? receiverChainIcon.explorer : receiverChainIcon.icon}
          onMouseEnter={() => onHover('target')}
          onMouseLeave={() => onLeave('target')}
          onClick={() => {
            if (activity.transactionHash) window.open(receiveTransactionHashLink, '_blank')
          }}
          className={`mr-2 h-[20px] ${activity.transactionHash ? 'cursor-pointer opacity-1' : 'opacity-40'}`}
        />
        {truncateAddress(activity.to)}
      </div>
      <div className={'flex flex-1'}>{new Date(activity.createdAt).toLocaleString()}</div>
    </div>
  )
}

const UserActivity = ({ activities }: { activities: ActivityType[] }) => {
  return (
    <>
      <div className="w-full">
        <div>
          {
            activities.map((activity, index) => {
              return (
                <ActivitySend key={index} activity={activity} />
              )
            })
          }
        </div>
      </div>
    </>
  )
}

export default UserActivity
