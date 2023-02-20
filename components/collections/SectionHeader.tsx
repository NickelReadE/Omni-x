import React from "react";
import Image from "next/image";
import SpinLoader from "./SpinLoader";
import classNames from "../../helpers/classNames";

interface ISectionHeaderProps {
  sectionNo: number;
  title: string;
  processing: boolean;
  active: boolean;
  completed: boolean;
}

const SectionHeader: React.FC<ISectionHeaderProps> = ({ sectionNo, title, processing, active, completed }) => {
  return (
    <div className={classNames("section-header", active ? "active" : "", "flex items-center")}>
      <p
        className={`${
          active ? "bg-primary-gradient" : "bg-secondary"
        } w-[18px] h-[18px] rounded-full text-black text-md flex items-center justify-center`}
      >
        {sectionNo}
      </p>
      <p className={`${active ? "bg-primary-gradient bg-clip-text text-transparent" : "text-secondary"} px-2 text-lg`}>{title}</p>
      {completed && <Image src={"/images/icons/check.svg"} alt='completed' width={18} height={18} />}
      {!completed && active && processing && <SpinLoader />}
    </div>
  );
};

export default SectionHeader;
