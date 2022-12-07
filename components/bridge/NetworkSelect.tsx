import React from 'react'
import Select, { components } from 'react-select'
import {CHAIN_NAMES, SUPPORTED_CHAIN_IDS} from '../../utils/constants'

const { Option } = components
const IconOption = (props: any) => (
  <Option {...props} className={'bg-primary'}>
    <div className='flex justify-start items-center text-md'>
      {props.data.text}
    </div>
  </Option>
)
const NetworkSelectValue = (props: any) => (
  <div className='flex justify-start items-center bg-primary text-md'>
    {props.data.text}
  </div>
)

interface INetworkSelectProps {
  value: object,
  onChange?: any,
}

const NetworkSelect: React.FC<INetworkSelectProps> = ({
  value,
  onChange
}) => {
  const optionData = SUPPORTED_CHAIN_IDS.map((chainId: number) => {
    return {
      text: CHAIN_NAMES[chainId],
      value: chainId
    }
  })

  return (
    <Select
      placeholder="Select"
      styles={{
        indicatorSeparator: (styles:any) => ({ ...styles,
          display: 'none'
        }),
        option: (styles:any) => ({ ...styles,
          background: '#969696',
          color: '#F5F5F5',
        }),
        menu: (styles:any) => ({ ...styles,
          background: '#969696',
          color: '#F5F5F5',
        }),
        control: (styles:any) => ({ ...styles,
          borderRadius: '20px',
          maxHeight: 24,
          minHeight: 28,
          color: '#F5F5F5',
          height: 24,
          fontWeight: 500,
          backgroundColor: 'transparent',
          border: '1px solid #969696',
          width: 170
        }),
        dropdownIndicator: (styles:any) => ({ ...styles,
          padding: 2,
        }),
        indicatorsContainer: (styles:any) => ({ ...styles,
          padding: 2,
        }),
        valueContainer: (styles:any) => ({ ...styles,
          display: 'flex',
          justifyContent: 'center',
          paddingRight: 0,
          paddingBottom: 0,
          paddingTop: 0
        }),
      }}
      value={value}
      options={optionData}
      isSearchable={ false }
      onChange={onChange}
      components={{ Option: IconOption, SingleValue: NetworkSelectValue }}
      isDisabled={!onChange}
    />
  )
}

export default NetworkSelect
