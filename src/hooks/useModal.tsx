import React, { createContext, useContext, useState } from 'react'
import { SimpleModal, MODAL_TYPES } from '../components/Modal/SimpleModal'

interface IShowSimple {
  error: (message: string, styles?: React.CSSProperties, color?: string) => void
  warning: (message: string, isShowButton?: boolean, styles?: React.CSSProperties) => void
  success: (message: string, styles?: React.CSSProperties) => void
}

interface ModalContextData {
  modalVisible: boolean
  message: JSX.Element | null
  closeable: boolean
  showMessage: (
    MessageComponent: React.FC<any>,
    props?: { [x: string]: unknown },
    isCloseable?: boolean,
  ) => void
  closeModal: () => void
  showSimple: IShowSimple
}

const ModalContext = createContext<ModalContextData>({} as ModalContextData)

interface ModalProviderProps {
  children: React.ReactNode;
}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [closeable, setCloseable] = useState(false)
  const [message, setMessage] = useState<JSX.Element | null>(null)

  const showMessage = (
    MessageComponent: React.FC<any>,
    props?: { [x: string]: unknown },
    isCloseable = false,
  ) => {
    setCloseable(isCloseable)
    setMessage(<MessageComponent {...props} />)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)

    const removeContentToAnimation = () => {
      setMessage(null)
    }

    setTimeout(removeContentToAnimation, 300)
  }

  const error = (
    message: string,
    styles?: React.CSSProperties,
    color?: string,
  ) => {
    showMessage(SimpleModal, {
      type: MODAL_TYPES.ERROR,
      message,
      styles,
      color,
    })
  }

  const warning = (message: string, isShowButton?: boolean, styles?: React.CSSProperties) => {
    showMessage(SimpleModal, {
      type: MODAL_TYPES.WARNING,
      message,
      styles,
      isShowButton,
    })
  }

  const success = (message: string, styles?: React.CSSProperties) => {
    showMessage(SimpleModal, {
      type: MODAL_TYPES.SUCCESS,
      message,
      styles,
    })
  }

  const showSimple = {
    error,
    warning,
    success,
  }

  return (
    <ModalContext.Provider
      value={{
        modalVisible,
        message,
        closeable,
        showMessage,
        closeModal,
        showSimple,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

const useModal = (): ModalContextData => {
  const context = useContext(ModalContext)
  return context
}

export { ModalProvider, useModal }
