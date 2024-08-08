import React from 'react'
import { useDispatch } from 'react-redux'
import Button from 'src/components/Form/Button'
import { useModal } from 'src/hooks/useModal'
import { LAYOUT_MAKE_REQUEST } from 'src/store/actions'
import { DeleteDocuments } from '../types'
import { ButtonGroup, Container, Text } from './style'

const RemoveConfirmationDocuments: React.FC<DeleteDocuments> = ({ fileName, deleteDocument, loading, setMakeRequest }) => {
  const { closeModal } = useModal()
  const dispatch = useDispatch()

  const confirmation = async () => {
    deleteDocument && await deleteDocument(fileName)
    setMakeRequest && setMakeRequest(Math.random())
    dispatch && dispatch({
      type: LAYOUT_MAKE_REQUEST,
      payload: {
        makeRequest: Math.random(),
      },
    })
    closeModal()
  }

  return (
    <Container>
      <Text alignSelf="center" fontSize="20px" bold>
        Deseja realmente excluir o documento?
      </Text>
      <Text flexDirection="column">
        <div>
          Arquivo: <span>{fileName}</span>
        </div>
      </Text>
      <Text>
        Ao clicar em <span>SIM</span> a operação não poderá ser desfeita.
      </Text>
      <ButtonGroup>
        <Button
          textButton="Sim"
          variant="outlined"
          color="error"
          icon="delete"
          onClick={confirmation}
          loading={loading}
        />
        <Button
          textButton="Não"
          variant="outlined"
          icon="close"
          onClick={closeModal}
        />
      </ButtonGroup>
    </Container>
  )
}

export default RemoveConfirmationDocuments
