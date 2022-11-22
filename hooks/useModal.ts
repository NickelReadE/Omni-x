import { useContext, useEffect } from 'react'
import { ModalContext, ModalContextType } from '../contexts/modal'

export const useModal = (): ModalContextType => {
  const {modal, openModal, closeModal} = useContext(ModalContext)

  return {
    modal,
    openModal,
    closeModal
  }
}
