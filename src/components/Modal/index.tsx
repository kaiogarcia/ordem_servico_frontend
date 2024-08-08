/* eslint-disable react-hooks/exhaustive-deps */
import React, { MouseEvent, useEffect, useRef } from 'react'
import closeIcon from '../../assets/icons/close.svg'
import { useModal } from '../../hooks/useModal'
import { Container } from './styles'

const Modal: React.FC = () => {
  const modalRef = useRef(null)
  const body = document.querySelector('body')

  const { message, modalVisible, closeable, closeModal } = useModal()

  useEffect(() => {
    if (body) {
      body.style.overflow = modalVisible ? 'hidden' : 'auto'
    }
  }, [modalVisible, body?.style.overflow])

  useEffect(() => {
    const closeModalEvent = (event: KeyboardEvent) => {
      if (closeable && event.key === 'Escape') {
        closeModal()
      }
    }

    window.addEventListener('keydown', closeModalEvent)

    return () => window.removeEventListener('keydown', closeModalEvent)
  }, [closeable])

  const onClickOutModal = (event: MouseEvent) => {
    if (closeable && event.target === modalRef.current) {
      //closeModal()
    }
  }

  return (
    <Container show={modalVisible} onClick={onClickOutModal} ref={modalRef}>
      <div>
        {closeable && (
          <span data-test="fechar-modal" onClick={closeModal}>
            <img src={closeIcon} alt="" />
          </span>
        )}
        {message}
      </div>
    </Container>
  )
}

export default Modal
