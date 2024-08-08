/* eslint-disable jsx-a11y/alt-text */
import React from 'react'

import errorIcon from '../../../assets/icons/alerts/error.svg'
import warningIcon from '../../../assets/icons/alerts/warning.svg'
import successIcon from '../../../assets/icons/alerts/success.svg'

import { useModal } from '../../../hooks/useModal'
import { Button } from '../../../components'

import { Container } from './styles'

export const MODAL_TYPES = {
  ERROR: 'error',
  WARNING: 'warning',
  SUCCESS: 'success',
}

const icons = {
  [MODAL_TYPES.ERROR]: errorIcon,
  [MODAL_TYPES.WARNING]: warningIcon,
  [MODAL_TYPES.SUCCESS]: successIcon,
}

interface ISimpleModal {
  type: string
  message: string
  styles?: React.CSSProperties
  color?: string
  isShowButton?: boolean
}

export const SimpleModal: React.FC<ISimpleModal> = ({
  type,
  message,
  styles,
  color,
  isShowButton = true
}) => {
  const { closeModal } = useModal()

  const onOk = () => {
    closeModal()
  }

  return (
    <Container style={styles}>
      <img src={icons[type]} />
      <p>{message}</p>
      {isShowButton && <Button
        onClick={onOk}
        color="success"
        variant="outlined"
        textButton="Ok"
      />}
    </Container>
  )
}
