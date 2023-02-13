import {useEffect, useState} from 'react'
import {UserCollectionType} from '../../types/collections'
import {userService} from '../../services/users'
import useWallet from '../../hooks/useWallet'
import UserCollectionCard from './UserCollectionCard'
import {getETHPrice} from '../../utils/helpers'

const UserCollections = () => {
  const {address} = useWallet()

  const [ethPrice, setEthPrice] = useState<number>(0)
  const [collections, setCollections] = useState<UserCollectionType[]>([])

  useEffect(() => {
    (async () => {
      if (address) {
        const _collections = await userService.getUserCollections(address)
        setCollections(_collections)
      }
    })()
  }, [address])

  useEffect(() => {
    (async () => {
      const ethPrice = await getETHPrice()
      setEthPrice(ethPrice)
    })()
  }, [])

  return (
    <div className={'grid grid-cols-4 gap-4'}>
      {
        collections.map((collection, index) => {
          return <UserCollectionCard key={index} collection={collection} ethPrice={ethPrice} />
        })
      }
    </div>
  )
}

export default UserCollections
