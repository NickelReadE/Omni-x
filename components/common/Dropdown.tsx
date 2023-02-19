import { Menu } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

type MenuItem = {
  text: string;
  value: string | any;
};

interface IDropdownProps {
  menus: MenuItem[];
  defaultMenu?: MenuItem;
  className?: string;
  onChange: (value: string) => void;
}

const Dropdown = ({ menus, defaultMenu, className, onChange }: IDropdownProps) => {
  const [selectedMenu, setSelectedMenu] = useState<string>("");

  useEffect(() => {
    if (menus.length > 0) {
      setSelectedMenu(menus[0].text);
    }
    if (defaultMenu) {
      setSelectedMenu(defaultMenu.text);
    }
  }, [menus, defaultMenu]);

  const onChangeMenu = (item: MenuItem) => {
    setSelectedMenu(item.text);
    onChange(item.value);
  };

  return (
    <div className={"relative"}>
      <Menu as={"div"} className={`w-full min-w-[230px] ${className ?? ""}`}>
        <>
          <Menu.Button
            className={
              "bg-[#303030] text-primary-light text-md flex items-center rounded-full justify-between py-3 px-5 font-medium cursor-pointer h-[38px] w-full"
            }
          >
            <span>{selectedMenu}</span>
            <img src={"/images/icons/arrow_down.svg"} alt={"arrow"} />
          </Menu.Button>
          <Menu.Items className={"absolute z-10 top-0 bg-[#303030] rounded-[20px] right-0 left-0 max-h-[230px] overflow-y-auto"}>
            <Menu.Item as={Fragment}>
              <div
                className={"cursor-pointer text-primary-light flex items-center justify-between h-[38px] w-full px-5 font-medium text-md"}
              >
                <span>{selectedMenu}</span>
                <img src={"/images/icons/arrow_down.svg"} alt={"arrow"} className={"rotate-180"} />
              </div>
            </Menu.Item>
            <div className={"overflow-y-auto max-h-[180px]"}>
              {menus.map((item, index) => {
                return (
                  <Menu.Item key={index} as={Fragment}>
                    {({ active }) => (
                      <div
                        className={`${
                          active && "bg-gray-50 rounded-[20px]"
                        } cursor-pointer text-secondary flex items-center h-[38px] w-full px-5 font-medium text-md`}
                        onClick={() => onChangeMenu(item)}
                      >
                        {item.text}
                      </div>
                    )}
                  </Menu.Item>
                );
              })}
            </div>
          </Menu.Items>
        </>
      </Menu>
    </div>
  );
};

export default Dropdown;
