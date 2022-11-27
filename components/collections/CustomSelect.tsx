import React, {} from 'react'
import Select, { components } from 'react-select'

const { Option } = components
const IconOption = (props: any) => (
  <Option {...props} className={'bg-primary'}>
    <div className='flex justify-start items-center text-md'>
      {props.data.text}
    </div>
  </Option>
)
const CustomSelectValue = (props: any) => (
  <div className='flex justify-start items-center bg-primary text-md'>
    {props.data.text}
  </div>
)

interface ICustomSelectProps {
  optionData: any[],
  value: object,
  onChange?: any,
}

const CustomSelect: React.FC<ICustomSelectProps> = ({
  optionData,
  value,
  onChange
}) => {
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
          maxWidth: '100px',
          borderRadius: '20px',
          color: '#F5F5F5',
          height: 30,
          backgroundColor: 'transparent',
          border: '1px solid #969696',
          width: '170px'
        }),
        valueContainer: (styles:any) => ({ ...styles,
          display: 'flex',
          justifyContent: 'center',
          paddingRight: 0
        }),
      }}
      value={value}
      options={optionData}
      isSearchable={ false }
      onChange={onChange}
      components={{ Option: IconOption, SingleValue: CustomSelectValue }}
      isDisabled={!onChange}
    />
  )
}

export default CustomSelect
