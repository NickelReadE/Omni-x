import {ReactNode, useState} from 'react'

interface IAccordionProps {
    title: string,
    children: ReactNode
}

const Accordion = ({ title, children }: IAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={'mt-4 rounded-lg border-[1px] border-[#383838] bg-dark-gradient cursor-pointer'}>
      <div className={'w-full h-[56px] flex justify-between items-center px-4'} onClick={() => setIsOpen(!isOpen)}>
        <span className={'text-secondary text-xl'}>{title}</span>
        <div className={'w-10 h-10 flex items-center justify-center'}>
          <img src={'/images/icons/caret_down.svg'} alt={'caret down'} className={isOpen ? 'rotate-180' : ''}/>
        </div>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} px-4 pb-4`}>
        {children}
      </div>
    </div>
  )
}

export default Accordion