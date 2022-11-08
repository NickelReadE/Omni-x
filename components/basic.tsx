export const GradientSpan = ({ children, className, background }: { children: React.ReactNode, className?: string, background?: string }) => {
  return (
    <span className={`${background ? background : 'bg-primary-gradient'} bg-clip-text text-center text-transparent ${className}`}>
      {children}
    </span>
  )
}