import {useState} from 'react'

interface IPrimaryButtonProps {
    text: string,
}

export const PrimaryButton = ({ text }: IPrimaryButtonProps) => {
  const [hovered, setHovered] = useState(false)

  return (
    <button className={'bg-primary-gradient rounded-full p-[1px]'} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div
        className={`${hovered ? 'bg-transparent' : 'bg-primary'} flex items-center rounded-full px-[15px] py-[7px] h-full`}>
        <span
          className={`${hovered ? 'text-black' : ''} bg-primary-gradient bg-clip-text text-transparent text-[16px] font-medium`}>{text}</span>
      </div>
    </button>
  )
}