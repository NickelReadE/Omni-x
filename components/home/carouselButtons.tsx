import React from 'react'

interface IPropsButton {
    selected: boolean,
    onClick: () => void
}

export const DotButton = ({ selected, onClick }: IPropsButton) => (
  <button
    className={`embla__dot ${selected ? 'is-selected' : ''}`}
    type="button"
    onClick={onClick}
  />
)
