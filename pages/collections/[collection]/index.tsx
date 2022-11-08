/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { NextPage } from 'next'
import { Switch } from '@headlessui/react'
import LazyLoad from 'react-lazyload'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import Checkbox from '@material-ui/core/Checkbox'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import Chip from '@material-ui/core/Chip'
import Discord from '../../../public/images/discord.png'
import Twitter from '../../../public/images/twitter.png'
import Web from '../../../public/images/web.png'
import Explorer from '../../../public/images/exp.png'
import Loading from '../../../public/images/loading_f.gif'
import {
  getRoyalty,
  selectRoyalty
} from '../../../redux/reducers/collectionsReducer'
import NFTBox from '../../../components/collections/NFTBox'
import classNames from '../../../helpers/classNames'
import editStyle from '../../../styles/collection.module.scss'
import { getBlockExplorer } from '../../../utils/constants'
import useWallet from '../../../hooks/useWallet'
import useCollection from '../../../hooks/useCollection'
import useCollectionNfts from '../../../hooks/useCollectionNfts'
import useData from '../../../hooks/useData'
import Dropdown from '../../../components/dropdown'

const sort_fields = [
  { text: 'price: high to low', value: '-price' },
  { text: 'price: low to high', value: 'price' },
  { text: 'Highest last sale', value: '-last_sale' },
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accordion: {
      width: '100%',
      boxShadow: 'none',
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
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
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
  const [currentTab, setCurrentTab] = useState<string>('items')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [expandedMenu, setExpandedMenu] = useState(0)
  const [selected, setSelected] = useState(sort_fields[0].value)
  const [enabled, setEnabled] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [searchObj, setSearchObj] = useState<any>({})
  const [filterObj, setFilterObj] = useState<any>({})
  const [isActiveBuyNow, setIsActiveBuyNow] = useState<boolean>(false)
  const [listNFTs, setListNFTs] = useState<any>([])
  const [explorerUrl, setExplorerUrl] = useState('')

  const router = useRouter()
  const col_url = router.query.collection as string
  const display_per_page = 10

  const dispatch = useDispatch()
  const classes = useStyles()
  const { collectionInfo, refreshCollection } = useCollection(col_url)
  const royalty = useSelector(selectRoyalty)
  const { signer, chainId } = useWallet()
  const { refreshUserNfts } = useData()
  const { nfts, hasMoreNFTs, fetchMoreData, refreshNfts } = useCollectionNfts(col_url, display_per_page, selected, searchObj, collectionInfo)

  useEffect(() => {
    if (collectionInfo && collectionInfo.address && chainId) {
      const baseBlockExplorer = getBlockExplorer(chainId)
      if (baseBlockExplorer) {
        setExplorerUrl(baseBlockExplorer + '/address/' + collectionInfo.address[chainId.toString()])
      }
    }
  }, [collectionInfo])

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

  useEffect(() => {
    dispatch(getRoyalty('ERC721', '0x4aA142f1Db95B50dA7ca22267Da557050f9A7Ec9', 5, signer) as any)
  }, [])

  const onChangeSort = (value: string) => {
    setSelected(value)
  }

  const onRefresh = async () => {
    await refreshNfts()
    refreshCollection()
    refreshUserNfts()
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

  return (
    <>
      <div className={classNames('w-full', 'mt-20', 'pr-[70px]', 'pt-[30px]', 'relative', editStyle.collection)}>
        <div className="w-[100%] h-[100%] mt-20">
          <img
            alt={''}
            className={classNames(editStyle.bannerImg)}
            src={collectionInfo && collectionInfo.banner_image ? collectionInfo.banner_image : ''}
          />
          <div className={classNames(editStyle.bannerOpacity)} />
        </div>
        <div className="flex space-x-8 items-end ml-[70px]">
          <LazyLoad placeholder={<img src={'/images/omnix_logo_black_1.png'} alt="logo" />}>
            <img
              className="w-[200px] h-[200px]"
              src={imageError ? '/images/omnix_logo_black_1.png' : (collectionInfo && collectionInfo.profile_image ? collectionInfo.profile_image : '/images/omnix_logo_black_1.png')}
              alt="logo" onError={() => {
                setImageError(true)
              }}
              data-src={collectionInfo && collectionInfo.profile_image ? collectionInfo.profile_image : ''}
            />
          </LazyLoad>
          <div className="flex relative text-lg font-bold text-center items-center pb-6 h-[64px]">
            <div className={'select-none inline-block px-4 text-xxl font-extrabold'}>
              {collectionInfo ? collectionInfo.name : ''}
            </div>
            <div className="w-[30px] h-[30px] bg-[#B444F9] rounded-[30px] flex items-center justify-center">
              <div className=" w-[15px] h-[9px] border-b-[3px] border-l-[3px] border-white -rotate-45 "></div>
            </div>
            {collectionInfo && collectionInfo.discord ?
              <Link href={collectionInfo.discord}>
                <a target="_blank" className="p-2 flex items-center">
                  <Image src={Discord} width={25} height={21} alt="discord" />
                </a>
              </Link>
              :
              <a target="_blank" className="p-2 flex items-center">
                <Image src={Discord} width={25} height={21} alt="discord" />
              </a>
            }
            {collectionInfo && collectionInfo.twitter ?
              <Link href={collectionInfo.twitter}>
                <a target="_blank" className="p-2 flex items-center">
                  <Image src={Twitter} alt="twitter" />
                </a>
              </Link>
              :
              <a target="_blank" className="p-2 flex items-center">
                <Image src={Twitter} alt="twitter" />
              </a>
            }
            {collectionInfo && collectionInfo.website ?
              <Link href={collectionInfo.website}>
                <a target="_blank" className="p-2 flex items-center">
                  <Image src={Web} alt="website" />
                </a>
              </Link>
              :
              <a target="_blank" className="p-2 flex items-center">
                <Image src={Web} alt="website" />
              </a>
            }
            <Link href={explorerUrl}>
              <a target="_blank" className="p-2 flex items-center">
                <Image src={Explorer} alt="website" />
              </a>
            </Link>
          </div>
        </div>
        <div className="w-full  mt-[-100px] border-b-2 border-[#E9ECEF]">
          <div className="flex">
            <div className="w-[320px] min-w-[320px]" />
          </div>
          <div className="flex">
            <div className="w-[320px] min-w-[320px]">
            </div>
            <div className="flex w-full justify-between items-end">
              <div className="flex flex-col">
                <ul className="flex relative justify-item-stretch text-lg font-bold text-center">
                  <li
                    className={`select-none inline-block p-4  w-32	 cursor-pointer z-30 ${currentTab === 'items' ? 'text-[#1E1C21] border-b-2 border-black' : ' text-[#A0B3CC]'} `}
                    onClick={() => setCurrentTab('items')}>
                    items
                  </li>
                  <li
                    className={'select-none inline-block p-4  w-32	 cursor-pointer  z-20  text-[#A0B3CC]'}>activity
                  </li>
                  <li className={'select-none inline-block p-4  w-32	 cursor-pointer  z-10  text-[#A0B3CC]'}>stats
                  </li>
                </ul>
              </div>

              <ul
                className="flex space-x-4 relative justify-item-stretch items-end text-md font-bold text-center pb-[5px]">
                <li
                  className="inline-block px-[13px] py-[13px] h-fit flex justify-items-center  z-30 bg-[#E7EDF5] rounded-lg font-extrabold">
                  <span className="mr-[22px] ">Items</span>
                  <span>{collectionInfo && (collectionInfo.itemsCnt || 0)}</span>
                </li>
                <li
                  className="inline-block px-[13px] py-[13px] h-fit flex justify-items-center  z-30 bg-[#E7EDF5] rounded-lg font-extrabold">
                  <span className="mr-[22px] ">Owners</span>
                  <span>{collectionInfo && (collectionInfo.ownerCnt || 0)}</span>
                </li>
                <li
                  className="inline-block px-[13px] py-[13px] h-fit flex justify-items-center  z-30 bg-[#E7EDF5] rounded-lg font-extrabold">
                  <span className="mr-[22px] ">Listed</span>
                  <span>{collectionInfo && (collectionInfo.orderCnt || 0)}</span>
                </li>
                <li
                  className="inline-block px-[13px] py-[13px] h-fit flex justify-items-center  z-30 bg-[#E7EDF5] rounded-lg font-extrabold">
                  <span className="mr-[22px] ">Royalty Fee</span>
                  <span>{royalty}%</span>
                </li>
                {/*<li
                  className="inline-block px-[13px] py-[13px] h-fit flex flex-col space-y-4 justify-items-center  z-30 bg-[#E7EDF5] rounded-lg font-extrabold">
                  <div className="flex flex-col">
                    <div className="flex justify-start">
                      <span>Volume(Total)</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="mr-[10px] ">0</span>
                      <img src="/svgs/eth_asset.svg" alt="asset"></img>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex justify-start">
                      <span>Volume(7d)</span>
                    </div>
                    <div className="flex flex-row">
                      <span className="mr-[10px] ">0</span>
                      <img src="/svgs/eth_asset.svg" alt="asset"></img>
                    </div>
                  </div>
                </li>*/}
                <li
                  className="inline-block px-[13px] py-[13px] h-fit flex justify-items-center  z-30 bg-[#E7EDF5] rounded-lg font-extrabold">
                  <div className="flex flex-col space-y-2">
                    <div>
                      <span className="mr-[22px] ">Floor</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <div className="flex flex-row justify-between">
                        <span
                          className="mr-[22px] ">{collectionInfo && collectionInfo.floorPrice && (collectionInfo.floorPrice.eth || 0)}</span>
                        <img src="/svgs/eth_asset.svg" alt="asset"></img>
                      </div>
                      <div className="flex flex-row justify-between">
                        <span
                          className="mr-[22px] ">{collectionInfo && collectionInfo.floorPrice && (collectionInfo.floorPrice.usd || 0)}</span>
                        <img src="/svgs/usd_asset.svg" alt="asset"></img>
                      </div>
                      <div className="flex flex-row justify-between">
                        <span
                          className="mr-[22px] ">{collectionInfo && collectionInfo.floorPrice && (collectionInfo.floorPrice.omni || 0)}</span>
                        <img src="/svgs/omni_asset.svg" alt="asset"></img>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>

      <div className="w-full pr-[70px]">
        <div className="flex">
          <div className="w-[320px] min-w-[320px]">
            <ul className="flex flex-col space-y-4">
              <li className="w-full">
                <div
                  className={`w-full px-4 py-4 text-left text-g-600  font-semibold  ${expandedMenu == 1 ? 'active' : ''}`}
                >
                  Buy Now
                  <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    onClick={() => setIsActiveBuyNow(!isActiveBuyNow)}
                    className={`${enabled ? 'bg-[#E9ECEF]' : 'bg-[#E9ECEF]'}
                    pull-right relative inline-flex h-[22px] w-[57px] shrink-0 cursor-pointer rounded-full border-2 border-[#6C757D] transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className={`${enabled ? 'translate-x-6' : 'translate-x-px'}
                        pointer-events-none inline-block h-[16px] w-[28px] transform rounded-full bg-[#6C757D] shadow-lg ring-0 transition duration-200 ease-in-out mt-px`}
                    />
                  </Switch>
                </div>
              </li>
              <hr />
              {collectionInfo && collectionInfo.attrs && Object.keys(collectionInfo.attrs).map((key, idx) => {
                const attrs = collectionInfo.attrs
                return <li className="w-full" key={idx}>
                  <Accordion className={classes.accordion}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classNames(classes.heading, 'font-RetniSans')}
                        style={{ fontFamily: 'RetniSans' }}>{key}</Typography>
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
                                  color="default"
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
                  <hr />
                </li>
              })}
              {/* <li className="w-full">
                <button
                  className={`w-full px-8 py-4 text-left text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-xl ${expandedMenu==1?'active':''}`}
                >
                  Price
                  <span className="pull-right">
                    <i className={`${expandedMenu == 1 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
                  </span>
                </button>
              </li>
              <li className="w-full">
                <button
                  className={`w-full px-8 py-4 text-left text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-xl ${expandedMenu==1?'active':''}`}
                >
                  Blockchain
                  <span className="pull-right">
                    <i className={`${expandedMenu == 1 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
                  </span>
                </button>
              </li>
              <li className="w-full">
                <button
                  className={`w-full px-8 py-4 text-left text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-xl ${expandedMenu==1?'active':''}`}
                >
                  Rarity
                  <span className="pull-right">
                    <i className={`${expandedMenu == 1 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
                  </span>
                </button>
              </li>
              <li className="w-full">
                <button
                  className={`w-full px-8 py-4 text-left text-g-600 hover:bg-p-700 hover:bg-opacity-20 font-semibold hover:shadow-xl ${expandedMenu==1?'active':''}`}
                >
                  Attributes
                  <span className="pull-right">
                    <i className={`${expandedMenu == 1 ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}`}></i>
                  </span>
                </button>
              </li> */}
            </ul>
          </div>
          <div className="relative px-12 py-6 border-l-2 border-[#E9ECEF] w-full">
            <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 p-1 gap-4">
              <div className="2xl:col-start-4 xl:col-start-3 lg:col-start-2 md:col-start-1">
                <button
                  className="rounded-lg bg-[#38B000] text-[#F6F8FC] py-2 xl:text-xg lg:text-md w-full">make a
                  collection bid
                </button>
              </div>
              <div className="min-w-[180px] z-10 2xl:col-start-5 xl:col-start-4 lg:col-start-3 md:col-start-2">
                <Dropdown menus={sort_fields} onChange={onChangeSort} />
              </div>
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
                      classes={{ root: classes.chipRoot }}
                    />
                  })
                })
              }
            </div>
            <div className="mt-10 mb-5">
              {
                <InfiniteScroll
                  dataLength={nfts.length}
                  next={fetchMoreData}
                  hasMore={hasMoreNFTs}
                  loader={
                    <div className="flex justify-center items-center">
                      <div className="flex justify-center items-center w-[90%] h-[100px]">
                        {!isActiveBuyNow && <Image src={Loading} alt="Loading..." width="80px" height="80px" />}
                      </div>
                    </div>
                  }
                  endMessage={
                    <div></div>
                  }
                >
                  <div className="grid 2xl:grid-cols-5 gap-4 xl:grid-cols-3 md:grid-cols-2 p-1">
                    {!isActiveBuyNow && nfts.map((item, index) => {
                      return (
                        <NFTBox nft={item} key={index} col_url={col_url} onRefresh={onRefresh} />
                      )
                    })}
                    {isActiveBuyNow && listNFTs && buyComponent()}
                  </div>
                </InfiniteScroll>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Collection
