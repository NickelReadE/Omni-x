import { twMerge } from "tailwind-merge";

interface IGreenButtonProps {
  text: string;
  className?: string;
  onClick: () => void;
}

export const GreenButton = ({ text, className, onClick }: IGreenButtonProps) => {
  return (
    <button className={twMerge(`border-green-500 border rounded-full px-4 py-2 hover:bg-green-500 ${className ?? ""}`)} onClick={onClick}>
      <div className={"text-primary-light text-[16px] leading-[20px] h-[20px] font-medium"}>{text}</div>
    </button>
  );
};
