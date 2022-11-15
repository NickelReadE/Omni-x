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

export const GradientButton = ({ title, height, borderRadius, textSize }: { title: string, height: number, borderRadius: number, textSize: string }) => {
  const classes = useStyles({ borderRadius: borderRadius })
  return (
    <div className={classNames(classes.borderGradientRadius, `h-[${height}px] hover:cursor-pointer webkit-mask-composite`)} style={{'webkitMastComposite': 'xor'}}>
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
