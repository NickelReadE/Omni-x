import {useState} from 'react'
import {twMerge} from 'tailwind-merge'
import {SpinLoader} from '../../basic'

interface IPrimaryButtonProps {
    text: string,
    loading?: boolean,
    background?: string,
    className?: string,
    parentClassName?: string,
    onClick?: () => void
}

export const PrimaryButton = ({ text, loading, className, parentClassName, background, onClick }: IPrimaryButtonProps) => {
  const [hovered, setHovered] = useState(false)

  return (
    <button className={`flex items-center bg-primary-gradient rounded-full p-[1px] ${parentClassName ?? ''}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={onClick}>
      <div className={twMerge(`${hovered ? 'bg-transparent' : (background ?? 'bg-primary')} flex items-center justify-center rounded-full px-[15px] py-[7px] h-full ${className ?? ''}`)}>
        {
          loading && <SpinLoader />
        }
        <div
          className={`${hovered ? 'text-black' : ''} bg-primary-gradient bg-clip-text text-transparent text-[16px] h-[20px] leading-[20px] font-medium`}>{text}</div>
      </div>
    </button>
  )
}
