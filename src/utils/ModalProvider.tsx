import React, { useState, ReactElement, useContext } from 'react'
import { Portal, Modal } from 'react-native-paper'

export const ModalContext = React.createContext<{
  showModal: (body: ReactElement<any>) => void
  hideModal: () => void
}>({ hideModal: () => {}, showModal: () => {} })

export const ModalProvider: React.FC = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactElement<any> | null>(
    null
  )

  const showModal = (body: ReactElement<any>) => {
    setModalContent(body)
  }

  const hideModal = () => {
    setModalContent(null)
  }

  return (
    <ModalContext.Provider value={{ hideModal, showModal }}>
      {children}
      <Portal>
        <Modal visible={Boolean(modalContent)} onDismiss={hideModal}>
          {modalContent}
        </Modal>
      </Portal>
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('Modal context not instantiated')
  }

  return context
}
