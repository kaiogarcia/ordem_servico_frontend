import React, { useState } from 'react'
import Button from 'src/components/Form/Button'
import { useModal } from 'src/hooks/useModal'
import { ADMINISTRATION_PIECES } from 'src/layouts/typePath'
import { ButtonGroup, Container, Text } from './style'

type ConfirmationToSaveProps = {
  history: any
  clearAllFields: () => void
}

const ConfirmationToSave: React.FC<ConfirmationToSaveProps> = (props) => {
  const { closeModal } = useModal()
  const [loading, setLoading] = useState(false)

  const onStayOnThePage = () => {
    setLoading(true)
    props.clearAllFields()
    closeModal()
  }
  const onBack = () => {
    props.history.push(ADMINISTRATION_PIECES)
    closeModal()
  }

  return (
    <Container>
      <Text>Deseja adicionar outra peça?</Text>
      <ButtonGroup>
        <Button
          textButton="Sim"
          variant="outlined"
          color="error"
          icon="delete"
          onClick={onStayOnThePage}
          loading={loading}
        />
        <Button
          textButton="Não"
          variant="outlined"
          icon="close"
          onClick={onBack}
        />
      </ButtonGroup>
    </Container>
  )
}

export default ConfirmationToSave
