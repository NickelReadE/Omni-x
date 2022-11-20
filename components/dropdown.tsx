import {Menu} from '@headlessui/react'
import {Fragment, useEffect, useState} from 'react'
import ArrowDown from '../public/images/icons/arrow_down.svg'

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
          <Menu.Button className={'bg-[#303030] text-primary-light text-md flex items-center rounded-full justify-between py-3 px-5 font-medium cursor-pointer text-[#6C757D] min-w-[230px] h-[32px] w-full'}>
            <span>{selectedMenu}</span>
            <ArrowDown />
          </Menu.Button>
          <Menu.Items className={'absolute z-10 top-[32px] right-0 left-0'}>
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
