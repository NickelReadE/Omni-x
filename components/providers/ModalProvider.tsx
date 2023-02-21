import React, { useState } from "react";
import { ModalIDs, ModalContext } from "../../contexts/modal";
import ConfirmAccept, { IConfirmAcceptProps } from "../collections/ConfirmAccept";
import ConfirmBid, { IConfirmBidProps } from "../collections/ConfirmBid";
import ConfirmBuy, { IConfirmBuyProps } from "../collections/ConfirmBuy";
import ConfirmSell, { IConfirmSellProps } from "../collections/ConfirmSell";

type ModalProviderProps = {
  children?: React.ReactNode;
};

type ModalDataType = IConfirmSellProps | IConfirmBuyProps | IConfirmBidProps | IConfirmAcceptProps | undefined;

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modal, setModal] = useState(ModalIDs.MODAL_NONE);
  const [modalData, setModalData] = useState<ModalDataType>(undefined);

  const openModal = (_modal: ModalIDs, data: any) => {
    setModalData(data);
    setModal(_modal);
  };

  const closeModal = () => {
    setModal(ModalIDs.MODAL_NONE);
  };

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}

      {modal === ModalIDs.MODAL_LISTING && !!modalData && <ConfirmSell {...(modalData as IConfirmSellProps)} />}
      {modal === ModalIDs.MODAL_BUY && !!modalData && <ConfirmBuy {...(modalData as IConfirmBuyProps)} />}
      {modal === ModalIDs.MODAL_BID && !!modalData && <ConfirmBid {...(modalData as IConfirmBidProps)} />}
      {modal === ModalIDs.MODAL_ACCEPT && !!modalData && <ConfirmAccept {...(modalData as IConfirmAcceptProps)} />}
    </ModalContext.Provider>
  );
};
