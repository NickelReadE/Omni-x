import React, {useEffect, useState} from 'react'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import CustomSelect from './CustomSelect'
import Select from 'react-select'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
    },
    dlgWidth: {
      maxWidth: '800px',
      width: '800px',
      height: '620px'
    }
  }),
)
const currencies_list = [
  { value: 0, text: 'OMNI', icon: 'payment/omni.png', address: '0x49fB1b5550AFFdFF32CffF03c1A8168f992296eF' },
  { value: 1, text: 'USDC', icon: 'payment/usdc.png', address: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926' },
  { value: 2, text: 'USDT', icon: 'payment/usdt.png', address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad' },
]
const period_list = [
  { value: 0, text: '1 Day', period: 1, },
  { value: 1, text: '1 Week', period: 7, },
  { value: 2, text: '1 Month', period: 30, },
  { value: 3, text: '1 Year', period: 365, },
]

interface IConfirmSellProps {
  handleSellDlgClose: () => void,
  openSellDlg: boolean,
  nftImage: string,
  nftTitle: string,
  onSubmit?: any,
}

const ConfirmSell: React.FC<IConfirmSellProps> = ({
  handleSellDlgClose,
  openSellDlg,
  nftImage,
  nftTitle,
  onSubmit
}) => {
  const classes = useStyles()
  const [sellType, setSellType] = useState('fixed')
  const [price_in_usd, setPriceInUSD] = useState('')
  const [price, setPrice] = useState(0)
  const [currency, setCurrency] = useState(currencies_list[0])
  const [period, setPeriod] = useState(period_list[2])

  const onChangePrice = (e: any) => {
    setPrice(e.target.value)
  }

  useEffect(() => {
    if ( price >= 0 ) {
      setPriceInUSD(`~ $${price} USD`)
    } else {
      setPriceInUSD('')
    }
  }, [price])

  const onListing = () => {
    onSubmit(currency.address, price, period.period)
  }

  return (
    <Dialog open={openSellDlg} onClose={handleSellDlgClose} aria-labelledby="form-dialog-title" classes={{paper: classes.dlgWidth}}>
      <DialogTitle id="form-dialog-title" className={classes.root}>
        <div className="columns-2 mt-5">
          <div className="text-[#1E1C21] text-[28px] font-semibold">list item for sale</div>
          <div className="flex justify-end">
            <button className={`w-[132px] px-5 py-2 text-[#ADB5BD] font-['Roboto Mono'] font-semibold text-[16px] rounded-[8px] border-2 border-[#ADB5BD] ${sellType=='fixed'?'z-10 bg-[#E9ECEF]':'bg-[#F8F9FA]'}`} onClick={() => setSellType('fixed')}>fixed price</button>
            <button className={`w-[132px] px-5 py-2 text-[#6C757D] font-['Roboto Mono'] font-semibold text-[16px] rounded-[8px] border-2 border-[#ADB5BD] relative -left-2.5 ${sellType=='auction'?'z-10 bg-[#E9ECEF]':'bg-[#F8F9FA]'}`}>auction</button>
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        {
          sellType == 'auction' &&
          <>
            <div className='flex justify-between'>
              <div>
                <p className="text-[#6C757D] text-[18px] font-semibold">Starting Price</p>
                <div className="flex justify-start items-center mt-5">
                  <CustomSelect optionData={currencies_list} value={currency} onChange={(value: any) => setCurrency(value)} />
                  <input type="text" value="40.50" className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F8F9FA] border-[2px] border-[#E9ECEF] rounded-lg"/>
                  <span className="px-4 text-[#ADB5BD] font-light">~ $40.50 USD</span>
                </div>
                <p className="text-[#6C757D] text-[18px] font-semibold mt-10">Reserve Price</p>
                <div className="flex justify-start items-center mt-5">
                  <CustomSelect optionData={currencies_list} value={currency} onChange={(value: any) => setCurrency(value)} />
                  <input type="text" value="60.00" className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F8F9FA] border-[2px] border-[#E9ECEF] rounded-lg"/>
                  <span className="px-4 text-[#ADB5BD] font-light">~ $60.00 USD</span>
                </div>
                <p className="text-[#6C757D] text-[18px] font-semibold mt-10">Duration</p>
                <div className="flex justify-start items-center mt-5">
                  <Select
                    placeholder="Select"
                    styles={{
                      control: (styles:any) => ({ ...styles,
                        borderRadius: '8px',
                        backgroundColor: '#F8F9FA',
                        border: '2px solid #E9ECEF',
                        width: '170px'
                      })
                    }}
                    options={period_list as any}
                    isSearchable={ false }
                    getOptionLabel={(e:any) => e?.text}
                    getOptionValue={(e:any) => e?.value}
                    value={0}
                  />
                  <input type="text" value="60.00" className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F8F9FA] border-[2px] border-[#E9ECEF] rounded-lg"/>
                  <span className="px-4 text-[#ADB5BD] font-light">~ $60.00 USD</span>
                </div>
              </div>
            
              <div>
                <img className='rounded-[8px] max-w-[250px]' src={nftImage} />
                <p className='mt-2 text-center text-[#6C757D] font-medium'>{nftTitle}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 mt-10 flex items-end">
              <div className="col-span-1">
                <button className='bg-[#B00000] rounded text-[#fff] w-[95px] h-[35px]'>list</button>
              </div>
              <div className="col-span-3">
                <div className='flex justify-end'>
                  <p className='text-[12px] text-[#6C757D] font-semibold mr-6'>service fee:</p>
                  <p className='text-[12px] w-[60px] text-[#ADB5BD] font-light'>1.50% *</p>
                </div>
                <div className='flex justify-end'>
                  <p className='text-[12px] text-[#6C757D] font-semibold mr-6'>creator fee:</p>
                  <p className='text-[12px] w-[60px] text-[#ADB5BD] font-light'>2.00%</p>
                </div>
                <div className='flex justify-end'>
                  <p className='text-[12px] mt-1.5 text-[#ADB5BD] font-light italic text-right'>*purchases using $OMNI reduce buyer’s<br/>platform tax from 2% to 1.5%</p>
                </div>
              </div>
            </div>
          </>
        }
        {
          sellType == 'fixed' &&
          <>
            <div className='flex justify-between'>
              <div>
                <p className="text-[#6C757D] text-[18px] font-semibold">Sale Price</p>
                <div className="flex justify-start items-center mt-5">
                  <CustomSelect optionData={currencies_list} value={currency} onChange={(value: any) => setCurrency(value)} />
                  <input type="text" value={price} className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F8F9FA] border-[2px] border-[#E9ECEF] rounded-lg" onChange={onChangePrice}/>
                  <span className="px-4 text-[#ADB5BD] font-light">{price_in_usd}</span>
                </div>
                <p className="text-[#ADB5BD] text-[14px] font-light italic leading-6 w-[435px] mt-10">*sale funds are recieved on the blockchain the NFT is currently hosted on</p>
                <p className="text-[#6C757D] text-[18px] font-semibold mt-10">Duration</p>
                <div className="flex justify-start items-center mt-5">
                  <Select
                    placeholder="Select"
                    styles={{
                      control: (styles:any) => ({ ...styles,
                        borderRadius: '8px',
                        backgroundColor: '#F8F9FA',
                        border: '2px solid #E9ECEF',
                        width: '170px'
                      })
                    }}
                    options={period_list as any}
                    isSearchable={ false }
                    getOptionLabel={(e:any) => e?.text}
                    getOptionValue={(e:any) => e?.value}
                    value={period}
                    onChange={(value: any) => setPeriod(value)}
                  />
                  {/* <input type="text" value="60.00" className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F8F9FA] border-[2px] border-[#E9ECEF] rounded-lg"/>
                  <span className="px-4 text-[#ADB5BD] font-light">~ $60.00 USD</span> */}
                </div>
              </div>
              <div>
                <img className='rounded-[8px] max-w-[250px]' src={nftImage} />
                <p className='mt-2 text-center text-[#6C757D] font-medium'>{nftTitle}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 mt-20 flex items-end">
              <div className="col-span-1">
                <button className='bg-[#B00000] rounded text-[#fff] w-[95px] h-[35px]' onClick={() => onListing()}>list</button>
              </div>
              <div className="col-span-3">
                <div className='flex justify-end'>
                  <p className='text-[12px] text-[#6C757D] font-semibold mr-6'>service fee:</p>
                  <p className='text-[12px] w-[60px] text-[#ADB5BD] font-light'>1.50% *</p>
                </div>
                <div className='flex justify-end'>
                  <p className='text-[12px] text-[#6C757D] font-semibold mr-6'>creator fee:</p>
                  <p className='text-[12px] w-[60px] text-[#ADB5BD] font-light'>2.00%</p>
                </div>
                <div className='flex justify-end'>
                  <p className='text-[12px] mt-1.5 text-[#ADB5BD] font-light italic text-right'>*purchases using $OMNI reduce buyer’s<br/>platform tax from 2% to 1.5%</p>
                </div>
              </div>
            </div>
          </>
        }
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmSell
