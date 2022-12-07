import {twMerge} from 'tailwind-merge'

interface ISecondaryButtonProps {
    text: string,
    className?: string,
    onClick?: () => void
}

export const SecondaryButton = ({ text, className, onClick }: ISecondaryButtonProps) => {
  return (
    <button className={twMerge(`bg-primary-gradient rounded-full px-4 py-2 hover:shadow-[0_0_6px_rgba(0,240,236,1)] ${className ?? ''}`)} onClick={onClick}>
      <div className={'text-primary text-[16px] leading-[20px] h-[20px] font-medium'}>{text}</div>
    </button>
  )
}