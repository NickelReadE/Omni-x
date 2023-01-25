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
    <div className="flex items-center justify-between space-x-4 text-primary-light mt-4">
      <Link href={`/collections/${activity.col_url}/${activity.tokenId}`}>
        <div className="flex flex-1 items-center cursor-pointer bg-dark-gradient rounded-[8px] border-[1px] border-[#383838] backdrop-filter backdrop-blur-[15px] p-2">
          <img src={activity.tokenData?.image} alt={'token Image'} className={'max-h-[50px] w-[50px] object-contain'} />
          <div className={'flex flex-col space-y-2 ml-2'}>
            <span className={'text-primary-light text-lg'}>{activity.tokenData?.name}</span>
            <span className={'text-primary-light text-lg'}>{activity.tokenId}</span>
          </div>
        </div>
      </Link>

      <div className={'flex flex-1 text-primary-light text-md'}>{USER_ACTIVITY_TYPE_NAMES[activity.activity]}</div>

      <div className={'flex flex-1 items-center'}>
        {
          activity.srcChainId && (activity.activity === USER_ACTIVITY_TYPE.Send || activity.activity === USER_ACTIVITY_TYPE.Sell || activity.activity === USER_ACTIVITY_TYPE.Buy) &&
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
        <span className={'text-md'}>{activity.from ? truncateAddress(activity.from) : ''}</span>
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
        <span className={'text-md'}>{activity.to ? truncateAddress(activity.to) : ''}</span>
      </div>
      <div className={'flex flex-1 justify-end text-md'}>{new Date(activity.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        day: 'numeric',
        month: 'short',
      })}</div>
    </div>
  )
}

const UserActivity = ({ activities }: { activities: ActivityType[] }) => {
  return (
    <>
      <div className={'grid grid-cols-4 lg:grid-cols-6'}>
        <div className={'hidden lg:block'} />
        <div className="col-span-4 inline-flex flex flex-col rounded-md shadow-sm" role="group">
          {/*Content section*/}
          <div className="w-full">
            {
              activities.map((activity, index) => {
                return (
                  <ActivitySend key={index} activity={activity} />
                )
              })
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default UserActivity
