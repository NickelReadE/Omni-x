import {twMerge} from 'tailwind-merge'

interface IGreyButtonProps {
    text: string,
    className?: string,
    onClick?: () => void
}
export const GreyButton = ({ text, className, onClick }: IGreyButtonProps) => {
  return (
    <button className={twMerge(`flex items-center justify-center bg-transparent text-secondary rounded-full px-4 py-2 border-[1.5px] border-secondary hover:border-white hover:text-white ${className ?? ''}`)} onClick={onClick}>
      <span className="text-[16px] leading-[20px] font-medium">{text}</span>
    </button>
  )
}