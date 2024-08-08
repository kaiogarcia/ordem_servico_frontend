import React, { useState } from 'react'
import Button from 'src/components/Form/Button'
import { useModal } from 'src/hooks/useModal'
import { ButtonGroup, Container, Text } from './style'
import { FINANCIAL_SEE_ALL_EXPENSES } from 'src/layouts/typePath'
import { NewExpenses } from './NewExpenses'

type ConfirmationRegister = {
  history: any
  setMakeRequest: React.Dispatch<React.SetStateAction<number>>
}

const ConfirmationToSave: React.FC<ConfirmationRegister> = (
  props,
) => {
  const { closeModal, showMessage } = useModal()
  const [loading, setLoading] = useState(false)

  const onStayOnThePage = () => {
    setLoading(true)
    showMessage(NewExpenses, { setMakeRequest: props.setMakeRequest }, true)
  }
  const onBack = () => {
    props.history.push(FINANCIAL_SEE_ALL_EXPENSES)
    closeModal()
  }

  return (
    <Container>
      <Text>Deseja adicionar outra despesa?</Text>
      <ButtonGroup>
        <Button
          textButton="Sim"
          variant="outlined"
          color="info"
          icon="add3"
          loading={loading}
          onClick={onStayOnThePage}
        />
        <Button
          textButton="Não"
          variant="outlined"
          icon="close"
          color="error"
          loading={loading}
          onClick={onBack}
        />
      </ButtonGroup>
    </Container>
  )
}

export default ConfirmationToSave
