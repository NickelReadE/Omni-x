import { createContext } from 'react'

export enum ModalIDs {
  MODAL_NONE,
  MODAL_LISTING,
  MODAL_BUY,
  MODAL_BID,
  MODAL_ACCEPT,
}

export type ModalContextType = {
  modal: ModalIDs
  openModal: (modal: ModalIDs, data: any) => void
  closeModal: () => void
}

export const ModalContext = createContext<ModalContextType>({
  modal: ModalIDs.MODAL_NONE,
  openModal: (modal: ModalIDs, data: any) => {},
  closeModal: () => {}
})
