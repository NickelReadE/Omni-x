import React from "react";

interface IPropsButton {
  selected: boolean;
  onClick: () => void;
}

export const DotButton = ({ selected, onClick }: IPropsButton) => (
  <button
    className={`embla__dot bg-transparent cursor-pointer relative w-[80px] h-[30px] mr-[7.5px] ml-[7.5px] flex items-center outline-none ${
      selected ? "is-selected" : ""
    }`}
    type='button'
    onClick={onClick}
  />
);
