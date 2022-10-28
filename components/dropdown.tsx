import {Menu} from '@headlessui/react'
import {Fragment, useEffect, useState} from 'react'

type MenuItem = {
  text: string,
  value: string
}

interface IDropdownProps {
  menus: MenuItem[],
  onChange: (value: string) => void,
}

const Dropdown = ({ menus, onChange }: IDropdownProps) => {
  const [selectedMenu, setSelectedMenu] = useState<string>('')

  useEffect(() => {
    if (menus.length > 0) {
      setSelectedMenu(menus[0].text)
    }
  }, [menus])

  const onChangeMenu = (item: MenuItem) => {
    setSelectedMenu(item.text)
    onChange(item.value)
  }

  return (
    <div className={'relative'}>
      <Menu>
        <>
          <Menu.Button className={'bg-gray-50 flex rounded-md justify-around p-3 font-medium cursor-pointer text-[#6C757D] min-w-[230px] w-full'}>
            <img alt={'listing'} src="/images/listing.png" className="w-[21px] h-[22px]"/>
            <span>{selectedMenu}</span>
            <img alt={'listing'} src="/images/downArrow.png" className="w-[10px] h-[7px] ml-5 mt-auto mb-auto"/>
          </Menu.Button>
          <Menu.Items className={'absolute z-10 top-[48px] right-0 left-0'}>
            {
              menus.map((item, index) => {
                return (
                  <Menu.Item key={index} as={Fragment}>
                    {({ active }) => (
                      <div
                        className={`${active && 'bg-gray-50'} cursor-pointer text-[#6C757D] flex items-center rounded-md h-[44px] min-w-[230px] w-full bg-white pl-[60px]`}
                        onClick={() => onChangeMenu(item)}
                      >
                        {item.text}
                      </div>
                    )}
                  </Menu.Item>
                )
              })
            }
          </Menu.Items>
        </>
      </Menu>
    </div>
  )
}

export default Dropdown
