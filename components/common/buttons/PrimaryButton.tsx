import {useState} from 'react'
import {twMerge} from 'tailwind-merge'

interface IPrimaryButtonProps {
    text: string,
    className?: string,
    onClick?: () => void
}

export const PrimaryButton = ({ text, className, onClick }: IPrimaryButtonProps) => {
  const [hovered, setHovered] = useState(false)

  return (
    <button className={'bg-primary-gradient rounded-full p-[1px]'} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={onClick}>
      <div
        className={twMerge(`${hovered ? 'bg-transparent' : 'bg-primary'} flex items-center justify-center rounded-full px-[15px] py-[7px] h-full ${className ?? ''}`)}>
        <div
          className={`${hovered ? 'text-black' : ''} bg-primary-gradient bg-clip-text text-transparent text-[16px] h-[20px] leading-[20px] font-medium`}>{text}</div>
      </div>
    </button>
  )
}