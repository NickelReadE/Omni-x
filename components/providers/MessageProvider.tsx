import {createContext, ReactNode, useState} from 'react'

export type MessageContextType = {
  opened: boolean,
  activeRoomId: string,
  openMessage: (roomId: string) => void,
  closeMessage: () => void,
  setOpen: (status: boolean) => void,
}

export const MessageContext = createContext<MessageContextType>({
  opened: false,
  activeRoomId: '',
  openMessage: () => undefined,
  closeMessage: () => undefined,
  setOpen: () => undefined,
})

type MessageProviderProps = {
  children?: ReactNode
}

export const MessageProvider = ({
  children,
}: MessageProviderProps): JSX.Element => {
  const [opened, setOpened] = useState<boolean>(false)
  const [activeRoomId, setActiveRoomId] = useState<string>('')

  const setOpen = (status: boolean) => {
    setOpened(status)
  }

  const openMessage = (roomId: string) => {
    setActiveRoomId(roomId)
  }

  const closeMessage = () => {
    setActiveRoomId('')
  }

  return (
    <MessageContext.Provider
      value={{
        opened,
        activeRoomId,
        openMessage,
        closeMessage,
        setOpen
      }}
    >
      {children}
    </MessageContext.Provider>
  )
}
