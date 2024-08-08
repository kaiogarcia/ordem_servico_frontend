import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Button from 'src/components/Form/Button'
import { toast } from 'src/components/Widgets/Toastify'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { useAdmin } from 'src/services/useAdmin'
import { LAYOUT_MAKE_REQUEST } from 'src/store/actions'
import { PieceT } from 'src/store/Types'
import { ButtonGroup, Container, Text } from './style'

const RemoveConfirmation: React.FC<PieceT> = ({ id, description }) => {
  const { closeModal } = useModal()
  const { Loading } = useLoading()
  const { apiAdmin } = useAdmin()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const deleteClient = async () => {
    try {
      Loading.turnOn()
      setLoading(true)
      await apiAdmin.delete(`pieces/${id}`)
      toast.success(`Peça ${description} excluído com sucesso!`)
      closeModal()
      dispatch({
        type: LAYOUT_MAKE_REQUEST,
        payload: {
          makeRequest: Math.random(),
        },
      })
    } catch (error) {
      toast.error(
        `Ops, Houve um erro ao tentar excluir a peça ${description}, atualize a página e tente novamente.`,
      )
    } finally {
      Loading.turnOff()
      setLoading(false)
    }
  }

  return (
    <Container>
      <Text>Deseja realmente excluir a peça</Text>
      <Text bold>{description} ?</Text>
      <ButtonGroup>
        <Button
          textButton="Deletar"
          variant="outlined"
          color="error"
          icon="delete"
          loading={loading}
          onClick={() => deleteClient()}
        />
        <Button
          textButton="Fechar"
          variant="outlined"
          icon="close"
          onClick={() => closeModal()}
        />
      </ButtonGroup>
    </Container>
  )
}

export default RemoveConfirmation
