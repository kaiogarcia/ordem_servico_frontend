/* eslint-disable jsx-a11y/alt-text */
import React from 'react'

import { Button } from '../../../../../../components'
import warningIcon from '../../../../../../assets/icons/alerts/warning.svg'
import { Container, ButtonGroup } from './styles'
import { useModal } from '../../../../../../hooks/useModal'
import { useHistory } from 'react-router-dom'

const MessageConfirmation: React.FC = () => {
  const { closeModal } = useModal()
  const history = useHistory()

  const onContinueEdting = () => {
    closeModal()
  }
  const onCancelEdting = () => {
    closeModal()
    history.push('/administration/connections')
  }

  return (
    <Container>
      <img src={warningIcon} />
      <p>
        As informações não serão salvas.
        <br />
        Confirma a saída?
      </p>

      <ButtonGroup>
        <Button
          variant="outlined"
          onClick={onContinueEdting}
          textButton="Não"
        />
        <Button variant="outlined" onClick={onCancelEdting} textButton="Sim" />
      </ButtonGroup>
    </Container>
  )
}

export default MessageConfirmation
