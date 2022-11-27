// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, {ReactNode} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import classNames from '../helpers/classNames'

export const GradientSpan = ({ children, className, background }: { children: React.ReactNode, className?: string, background?: string }) => {
  return (
    <span className={`${background ? background : 'bg-primary-gradient'} bg-clip-text text-center text-transparent ${className}`}>
      {children}
    </span>
  )
}

const useStyles = makeStyles({
  borderGradientRadius: {
    display: 'inline-block',
    position: 'relative',
    color: 'white',
    width: '100%',
    zIndex: 0,
    '&:before': {
      aspectRatio: 1,
      width: '100%',
      height: '100%',
      content: '""',
      position: 'absolute',
      zIndex: -1,
      inset: 0,
      padding: 2,
      borderRadius: props => props.borderRadius,
      background: 'linear-gradient(103.58deg, #00F0EC 15.1%, #16FFC5 87.92%)',
      '-webkitMask': 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      maskComposite: 'exclude'
    }
  }
})

export const GradientButton = ({ title, height, borderRadius, textSize, onClick }: { title: string, height: number, borderRadius: number, textSize: string, onClick?: () => void }) => {
  const classes = useStyles({ borderRadius: borderRadius })
  return (
    <div className={classNames(classes.borderGradientRadius, `h-[${height}px] hover:cursor-pointer webkit-mask-composite`)} style={{WebkitMaskComposite: 'xor'}} onClick={onClick}>
      <div className={'w-full h-full flex items-center justify-center'}>
        <span className={`bg-primary-gradient text-${textSize} text-center bg-clip-text text-transparent`}>{title}</span>
      </div>
    </div>
  )
}

export const ExternalLink = ({ children, link }: { children: ReactNode, link: string | undefined }) => {
  if (link) {
    return (
      <a href={link} target="_blank" className="hover:cursor-pointer" rel="noreferrer">
        {children}
      </a>
    )
  }
  return (
    <div>{children}</div>
  )
}

export const Tooltip = ({ tooltipContent, children }: { tooltipContent: string, children: ReactNode }) => {
  return (
    <span className="relative group">
      <span
        className={[
          'whitespace-nowrap',
          'rounded',
          'bg-black',
          'px-2',
          'py-1',
          'text-white',
          'absolute',
          '-top-12',
          'left-1/2',
          '-translate-x-1/2',
          "before:content-['']",
          'before:absolute',
          'before:-translate-x-1/2',
          'before:left-1/2',
          'before:top-full',
          'before:border-4',
          'before:border-transparent',
          'before:border-t-black',
          'opacity-0',
          'group-hover:opacity-100',
          'transition',
          'pointer-events-none',
        ].join(' ')}
      >
        {tooltipContent}
      </span>
      {children}
    </span>
  )
}
