import { TextBody } from "../Basic";
import { toast, Slide } from "react-toastify";
import { truncateAddress } from "../../../utils/utils";

interface CopyAddressButtonProps {
  address: string;
  className?: string;
}

const okToast = (success: string): void => {
  toast.success(success, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
    transition: Slide
  });
};

export const CopyAddressButton = ({ address }: CopyAddressButtonProps) => {
  return (
    <div
      className={"flex items-center space-x-2 bg-[#202020] py-1 px-2 rounded-[12px] cursor-pointer hover:bg-[#303030]"}
      onClick={() => {
        navigator.clipboard.writeText(address);
        okToast("address copied");
      }}
    >
      <TextBody className={"text-[#4D94FF] leading-[16px]"}>{truncateAddress(address)}</TextBody>
      <img src={"/images/icons/copy.svg"} alt={"copy"} />
    </div>
  );
};
