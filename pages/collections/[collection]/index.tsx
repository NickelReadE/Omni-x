/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import type { NextPage } from 'next'
import { Switch } from '@headlessui/react'
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import Chip from '@material-ui/core/Chip'
import Loading from '../../../public/images/loading_f.gif'
import NFTBox from '../../../components/collections/NFTBox'
import classNames from '../../../helpers/classNames'
import editStyle from '../../../styles/collection.module.scss'
import useCollection from '../../../hooks/useCollection'
import useCollectionNfts from '../../../hooks/useCollectionNfts'
import useData from '../../../hooks/useData'
import Dropdown from '../../../components/dropdown'
import {CollectionBanner} from '../../../components/collections/banner'
import { useModal } from '../../../hooks/useModal'
import { ModalIDs } from '../../../contexts/modal'
import {SkeletonCard} from '../../../components/skeleton/card'
import {PrimaryButton} from '../../../components/common/buttons/PrimaryButton'
import {ChainSelection} from '../../../components/common/ChainSelection'
import {SUPPORTED_CHAIN_IDS} from '../../../utils/constants'
import {TextBodyemphasis} from '../../../components/basic'
import {CollectionPostCard} from '../../../components/collections/PostCard'

const sort_fields = [
  { text: 'price: low to high', value: 'price' },
  { text: 'price: high to low', value: '-price' },
  { text: 'Highest last sale', value: '-last_sale' },
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accordion: {
      minHeight: 34,
      width: '100%',
      boxShadow: 'none',
      background: 'linear-gradient(120.31deg, rgba(125, 125, 125, 0.2) 20%, rgba(125, 125, 125, 0.06) 85.18%)',
      border: '1px solid #383838',
      backdropFilter: 'blur(15px)',
      borderRadius: 6,
      '& .MuiAccordionDetails-root': {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '1rem'
      },
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexShrink: 0,
      color: 'rgb(108 117 125)',
      fontWeight: 600,
    },
    frmGroup: {
      width: '100%',
      maxHeight: '320px',
      display: 'block',
      overflowY: 'auto',
      overflowX: 'hidden',
      marginTop: '1rem',
      padding: '1rem',
    },
    frmLabel: {
      color: 'white',
      width: '100%'
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: '#423e3e26',
      '&:hover': {
        backgroundColor: '#423e3e40',
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: 0,
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'white',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      text: 'white',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
      '&:hover': {
        boxShadow: 'none',
      },
      '&:focus': {
        boxShadow: 'none',
      },
    },
    chipRoot: {
      marginRight: '5px',
      marginTop: '5px'
    }
  }),
)

const Collection: NextPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [expandedMenu, setExpandedMenu] = useState(0)
  const [selected, setSelected] = useState(sort_fields[0].value)
  const [enabled, setEnabled] = useState(false)
  const [searchObj, setSearchObj] = useState<any>({})
  const [filterObj, setFilterObj] = useState<any>({})
  const [isActiveBuyNow, setIsActiveBuyNow] = useState<boolean>(false)
  const [listNFTs, setListNFTs] = useState<any>([])
  const [filterVisible, setFilterVisible] = useState<boolean>(false)
  const [selectedChainIds, setSelectedChainIds] = useState<number[]>(SUPPORTED_CHAIN_IDS)
  const [tab, setTab] = useState<number>(0)
  const [postIndex, setPostIndex] = useState<number>(0)

  const router = useRouter()
  const col_url = router.query.collection as string
  const display_per_page = 10

  const classes = useStyles()
  const { collectionInfo, refreshCollection } = useCollection(col_url)
  const { refreshUserNfts } = useData()
  const { nfts, hasMoreNFTs, fetchMoreData, refreshNfts } = useCollectionNfts(col_url, display_per_page, selected, searchObj, collectionInfo)

  useEffect(() => {
    if (isActiveBuyNow && nfts.length > 0) {
      const temp = []
      for (let i = 0; i < nfts.length; i++) {
        if (nfts[i].price > 0) {
          temp.push(nfts[i])
        }
      }
      setListNFTs(temp)
    }
  }, [isActiveBuyNow, nfts])

  const collection_address_map = useMemo(() => {
    if (collectionInfo) {
      return collectionInfo.address
    }
  }, [collectionInfo])

  const onChangeSort = (value: string) => {
    setSelected(value)
  }

  const onRefresh = async () => {
    await refreshNfts()
    refreshCollection()
    refreshUserNfts()
  }

  const { openModal, closeModal } = useModal()
  const collectionBid = {
    collectionUrl: col_url,
    collectionAddressMap: collection_address_map
  }

  const onBuyFloor = (nft: any) => {
    const tradingInput = {
      collectionUrl: collectionBid.collectionUrl,
      collectionAddressMap: collectionBid.collectionAddressMap,
      tokenId: nft.token_id,
      selectedNFTItem: nft,
      onRefresh
    }

    openModal(ModalIDs.MODAL_BUY, {
      nftImage: nft.image,
      nftTitle: nft.name,
      order: nft.order_data,
      tradingInput,
      instantBuy: true,
      handleBuyDlgClose: closeModal
    })
  }

  const searchAttrsCheck = (bChecked: boolean, attrKey: string, valueKey: string) => {
    const obj = Array.isArray(searchObj[attrKey]) ? searchObj[attrKey] : []

    if (bChecked) {
      obj.push(valueKey)
    } else {
      const index = obj.indexOf(valueKey, 0)
      if (index > -1) {
        obj.splice(index, 1)
      }
    }
    const newObj = { [attrKey]: obj }
    setSearchObj((prevState: any) => {
      return { ...prevState, ...newObj }
    })
    let existFilter = false
    Object.keys(searchObj).map((aKey) => {
      if (searchObj[aKey].length > 0) {
        existFilter = true
      }
    })
    if (bChecked || existFilter) {
      //setClearFilter(true)
    }
  }

  const searchFilter = (searchValue: string, attrKey: string) => {
    const newObj = { [attrKey]: searchValue }
    setFilterObj((prevState: any) => {
      return { ...prevState, ...newObj }
    })
  }

  const handleFilterBtn = (attrKey: string, item: string) => {
    const obj = searchObj[attrKey]
    const index = obj.indexOf(item, 0)
    if (index > -1) {
      obj.splice(index, 1)
    }
    const newObj = { [attrKey]: obj }
    setSearchObj((prevState: any) => {
      return { ...prevState, ...newObj }
    })
  }

  const buyComponent = () => {
    const temp = []
    for (let i = 0; i < listNFTs.length; i++) {
      temp.push(
        <NFTBox nft={listNFTs[i]} key={i} col_url={col_url} onRefresh={onRefresh} />
      )
    }
    return temp
  }

  const addSelectedChainId = (chainId: number) => {
    setSelectedChainIds([...selectedChainIds, chainId])
  }

  const addAllChainIds = () => {
    setSelectedChainIds(SUPPORTED_CHAIN_IDS)
  }

  const removeSelectedChainId = (chainId: number) => {
    setSelectedChainIds(selectedChainIds.filter((id) => id !== chainId))
  }

  return (
    <>
      <div className={classNames('w-full', 'pt-6 pb-4 px-0', 'relative', editStyle.collection)}>
        {
          collectionInfo
            ?
            <CollectionBanner collection={collectionInfo} setSelectedTabIndex={setTab} />
            :
            <SkeletonCard />
        }
      </div>

      <div className={`grid ${filterVisible ? 'grid-cols-6' : 'grid-cols-5'} gap-4 mt-6`}>
        {
          <div className={`col-span-1 ${filterVisible ? 'block': 'hidden'}`}>
            <ul className="flex flex-col space-y-2">
              <li className="w-full">
                <div
                  className={`w-full px-4 py-2 text-left text-md text-secondary font-semibold ${expandedMenu == 1 ? 'active' : ''}`}
                >
                  Buy Now
                  <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    onClick={() => setIsActiveBuyNow(!isActiveBuyNow)}
                    className={'bg-transparent pull-right relative inline-flex h-[16px] w-[28px] shrink-0 cursor-pointer rounded-full border-[2px] border-[#969696] transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 flex items-center'}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className={`${enabled ? 'translate-x-3' : 'translate-x-px'}
                      pointer-events-none inline-block h-2 w-2 border-[2px] border-[#969696] transform rounded-full bg-transparent ring-0 transition duration-200 ease-in-out mt-px`}
                    />
                  </Switch>
                </div>
              </li>
              {collectionInfo && collectionInfo.attrs && Object.keys(collectionInfo.attrs).map((key, idx) => {
                const attrs = collectionInfo.attrs
                return <li className="w-full" key={idx}>
                  <Accordion className={classes.accordion}>
                    <AccordionSummary
                      expandIcon={<img src={'/images/icons/caret_down.png'} alt="caret-down" />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classNames('text-secondary text-md')}>{key}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div>
                        <div className={classes.search}>
                          <div className={classes.searchIcon}>
                            <SearchIcon />
                          </div>
                          <InputBase
                            placeholder="Search…"
                            classes={{
                              root: classes.inputRoot,
                              input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={(e) => {
                              searchFilter(e.target.value, key)
                            }}
                          />
                        </div>
                        <FormGroup classes={{ root: classes.frmGroup }}>
                          {
                            attrs[key].values && Object.keys(attrs[key].values).map((valueKey, valueIndex) => {
                              if (valueKey == 'none') {
                                return null
                              }
                              if (filterObj[key] && !valueKey.includes(filterObj[key].toLowerCase())) {
                                return null
                              }
                              return <FormControlLabel
                                key={valueIndex}
                                classes={{ label: classes.frmLabel, root: classes.frmLabel }}
                                control={<Checkbox
                                  checked={Array.isArray(searchObj[key]) && searchObj[key].indexOf(attrs[key].values[valueKey][3], 0) > -1}
                                  onChange={(e) => {
                                    searchAttrsCheck(e.target.checked, key, attrs[key].values[valueKey][3])
                                  }}
                                  color="primary"
                                  inputProps={{ 'aria-label': 'checkbox with default color' }} />
                                }
                                label={
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-[#4d5358]">{attrs[key].values[valueKey][3]}</span>
                                    <div className="text-right">
                                      {/*<p className="font-bold text-[#697077]">{attrs[key].values[valueKey][4]}</p>*/}
                                      {/*<p className="text-[11px] text-[#697077]">({attrs[key].values[valueKey][1]}%)</p>*/}
                                    </div>
                                  </div>
                                }
                              />
                            })
                          }
                        </FormGroup>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </li>
              })}
            </ul>
          </div>
        }
        {
          tab === 0 && <div className={filterVisible ? 'col-span-4' : 'col-span-5'}>
            <div className={'flex items-center justify-between'}>
              <div className={'flex items-center space-x-4'}>
                <Image src={`/images/icons/filter${filterVisible ? '_active' : ''}.svg`} width={38} height={38}
                  alt={'filter'} onClick={() => setFilterVisible(!filterVisible)}/>
                <Dropdown menus={sort_fields} onChange={onChangeSort}/>
                <ChainSelection selectedChainIds={selectedChainIds} addChainId={addSelectedChainId}
                  removeChainId={removeSelectedChainId} addAllChainIds={addAllChainIds}
                  setChainId={(chainId) => setSelectedChainIds([chainId])}/>
              </div>
              <PrimaryButton
                text={'bid collection'}
                className={'h-[38px] text-md font-medium'}
                onClick={() => {
                  openModal(ModalIDs.MODAL_BID, {
                    nftImage: collectionInfo?.profile_image,
                    nftTitle: collectionInfo?.name,
                    collectionBid,
                    collectionInfo: collectionInfo,
                    onBuyFloor,
                    handleBidDlgClose: closeModal
                  })
                }}
              />
            </div>
            <div className="mt-5">
              {
                Object.keys(searchObj).map((attrKey) => {
                  return searchObj[attrKey].map((item: any, index: any) => {
                    return <Chip
                      label={item}
                      onClick={() => handleFilterBtn(attrKey, item)}
                      onDelete={() => handleFilterBtn(attrKey, item)}
                      key={index}
                      classes={{root: classes.chipRoot}}
                    />
                  })
                })
              }
            </div>
            <div className="mt-6 mb-5 w-full">
              <InfiniteScroll
                dataLength={nfts.length}
                next={fetchMoreData}
                hasMore={hasMoreNFTs}
                loader={
                  <div className="flex justify-center items-center">
                    <div className="flex justify-center items-center w-[90%] h-[100px]">
                      {!isActiveBuyNow && <Image src={Loading} alt="Loading..." width="80px" height="80px"/>}
                    </div>
                  </div>
                }
                endMessage={
                  <div></div>
                }
              >
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${filterVisible ? 'xl:grid-cols-5 2xl:grid-cols-5' : 'xl:grid-cols-6 2xl:grid-cols-6'} gap-4 p-1`}>
                  {!isActiveBuyNow && nfts.map((item, index) => {
                    return (
                      <div key={index} className={'flex justify-center w-full'}>
                        <NFTBox nft={item} col_url={col_url} onRefresh={onRefresh}/>
                      </div>
                    )
                  })}
                  {isActiveBuyNow && listNFTs && buyComponent()}
                </div>
              </InfiniteScroll>
            </div>
          </div>
        }
        {
          filterVisible &&
              <div className={'col-span-1'} />
        }
      </div>
      {
        tab === 3 &&
          <div className={'flex flex-col'}>
            <div className={'flex items-center justify-between w-full'}>
              {/*Button Group section*/}
              <div className={'flex'}>
                <div
                  className={`${postIndex === 0 ? 'text-primary' : 'text-secondary'} text-center bg-primary-gradient rounded-l-lg p-[1px]`}>
                  <button
                    type="button"
                    className={`${postIndex === 0 ? 'bg-transparent' : 'bg-primary'} w-full py-2 px-4 text-md font-medium rounded-l-lg focus:z-10 focus:ring-0`}
                    onClick={() => setPostIndex(0)}
                  >
                    events
                  </button>
                </div>
                <div
                  className={`${postIndex === 1 ? 'text-primary' : 'text-secondary'} text-center bg-primary-gradient rounded-r-md p-[1px]`}>
                  <button
                    type="button"
                    className={`${postIndex === 1 ? 'bg-transparent' : 'bg-primary'} w-full py-2 px-4 text-md font-medium rounded-r-md focus:z-10 focus:ring-0`}
                    onClick={() => setPostIndex(1)}
                  >
                    announcements
                  </button>
                </div>
              </div>

              <div className={'bg-primary-gradient text-primary rounded-full py-2 px-4'}>
                <TextBodyemphasis>create a post</TextBodyemphasis>
              </div>
            </div>

            {/*Post section*/}
            <div className={'flex space-x-[30px] overflow-hidden mt-5'}>
              <CollectionPostCard />
              <CollectionPostCard />
              <CollectionPostCard />
            </div>
          </div>
      }
    </>
  )
}

export default Collection
