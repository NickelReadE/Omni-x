/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, Fragment, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import type {NextPage} from 'next'
import {
  getCollections,
  selectCollections,
  updateCollectionsForCard,
  selectCollectionsForCard,
} from '../../redux/reducers/collectionsReducer'
import {getOrders} from '../../redux/reducers/ordersReducer'
import Slider from '../../components/Slider'
import CollectionCard from '../../components/CollectionCard'
import {IGetOrderRequest} from '../../interface/interface'
import useWallet from '../../hooks/useWallet'
import {getChainNameFromId} from '../../utils/constants'

const Collections: NextPage = () => {
  const {chainId} = useWallet()
  const [omniSlides, setOmniSlides] = useState<Array<React.ReactNode>>([])
  const dispatch = useDispatch()
  const collections = useSelector(selectCollections)
  const collectionsForCard = useSelector(selectCollectionsForCard)

  useEffect(() => {
    if (chainId) {
      dispatch(updateCollectionsForCard(chainId.toString(), getChainNameFromId(chainId)) as any)
    }
  }, [chainId])

  useEffect(() => {
    dispatch(getCollections() as any)
  }, [])

  useEffect(() => {
    const slides: Array<React.ReactNode> = []
    if (collections.length > 0) {
      collections.map((item: any) => {
        slides.push(
          <CollectionCard collection={item} card={null}/>
        )
      })
    }
    setOmniSlides(slides)
  }, [collections, collectionsForCard])

  useEffect(() => {
    const request: IGetOrderRequest = {
      isOrderAsk: true,
      status: ['VALID'],
      sort: 'PRICE_ASC'
    }
    dispatch(getOrders(request) as any)
  }, [])

  return (
    <>
      <div className="pt-10">
        <Slider title="Beta Collections" cards={omniSlides}/>
      </div>
    </>
  )
}

export default Collections
