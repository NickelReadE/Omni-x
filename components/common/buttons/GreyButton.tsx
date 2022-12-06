interface IGreyButtonProps {
    text: string,
}
export const GreyButton = ({ text }: IGreyButtonProps) => {
  return (
    <div>
      <button className="bg-transparent text-secondary rounded-full px-4 py-2 border-[1.5px] border-secondary hover:border-white hover:text-white">
        <span className="text-[16px] leading-[20px] font-medium">{text}</span>
      </button>
    </div>
  )
}