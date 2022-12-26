import {twMerge} from 'tailwind-merge'

interface IGreyButtonProps {
    text: string,
    disabled?: boolean,
    className?: string,
    onClick?: () => void
}
export const GreyButton = ({ text, disabled, className, onClick }: IGreyButtonProps) => {
  return (
    <button className={twMerge(`flex items-center justify-center bg-transparent text-secondary rounded-full px-4 py-2 border-[1.5px] border-secondary ${disabled ? '' : 'hover:border-white hover:text-white'} ${className ?? ''}`)} onClick={onClick} disabled={disabled}>
      <span className="text-[16px] leading-[20px] font-medium">{text}</span>
    </button>
  )
}
