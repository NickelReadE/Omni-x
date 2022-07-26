import React, {useState} from 'react'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Select from 'react-select'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
    },
    dlgWidth: {
      maxWidth: '800px',
      width: '800px',
      height: '530px'
    }
  }),
)
interface SelectType {
  value: number;
  text: string;
}
const data: SelectType[] = [
  {
    value: 1,
    text: 'OMNI1',
    
  },
  {
    value: 2,
    text: 'OMNI2',
  },
]

const data1: SelectType[] = [
  {
    value: 1,
    text: '1 Day',
    
  },
  {
    value: 2,
    text: '1 Week',
  },
  {
    value: 3,
    text: '1 Month',
  },
  {
    value: 4,
    text: '1 Year',
  }
]
interface IConfirmBidProps {
  handleBidDlgClose: () => void,
  openBidDlg: boolean,
  nftImage: string,
  nftTitle: string,
}

const ConfirmBid: React.FC<IConfirmBidProps> = ({
  handleBidDlgClose,
  openBidDlg,
  nftImage,
  nftTitle,
}) => {
  const classes = useStyles()
  const [bidType, setBidType] = useState('fixed')
  const [selectedOption, setSelectedOption] = useState(null)

  // handle onChange event of the dropdown
  const handleChange = (e: any) => {
    setSelectedOption(e)
  }

  return (
    <Dialog open={openBidDlg} onClose={handleBidDlgClose} aria-labelledby="form-dialog-title" classes={{paper: classes.dlgWidth}}>
      <DialogTitle id="form-dialog-title" className={classes.root}>
        <div className="columns-2 mt-5">
          <div className="text-[#1E1C21] text-[28px] font-semibold">place bid</div>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className='flex justify-between'>
          <div>
            <p className="text-[#6C757D] text-[18px] font-semibold">Bid Price</p>
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
                value={selectedOption}
                options={data}
                isSearchable={ false }
                onChange={handleChange}
                getOptionLabel={(e:any) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={'/images/omnixcoin.svg'} />
                    <span className="text-[#1E1C21] ml-2 font-semibold">{e ? e.text : ''}</span>
                  </div>
                )}
              />
              <input type="text" value="40.50" className="text-[#000] font-semibold h-[40px] w-[110px] text-center mx-4 bg-[#F8F9FA] border-[2px] border-[#E9ECEF] rounded-lg"/>
              <span className="px-4 text-[#ADB5BD] font-light">~ $40.50 USD</span>
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
                options={data1}
                isSearchable={ false }
                getOptionLabel={(e:any) => e?.text}
                getOptionValue={(e:any) => e?.value}
              />
            </div>
          </div>
          <div>
            <img className='rounded-[8px] max-w-[250px]' src={nftImage} />
            <p className='mt-2 text-center text-[#6C757D] font-medium'>{nftTitle}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 mt-12 flex items-end">
          <div className="col-span-1">
            <button className='bg-[#38B000] rounded text-[#fff] w-[95px] h-[35px]'>bid</button>
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
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmBid
