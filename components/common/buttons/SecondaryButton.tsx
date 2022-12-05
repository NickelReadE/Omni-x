interface ISecondaryButtonProps {
    text: string,
}

export const SecondaryButton = ({ text }: ISecondaryButtonProps) => {
  return (
    <button className={'bg-primary-gradient rounded-full px-4 py-2 hover:shadow-[0_0_6px_rgba(0,240,236,1)]'}>
      <span className={'text-primary text-[16px] font-medium'}>{text}</span>
    </button>
  )
}