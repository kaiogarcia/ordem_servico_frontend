import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Button from 'src/components/Form/Button'
import { toast } from 'src/components/Widgets/Toastify'
import { exceptionHandle } from 'src/helpers/exceptions'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { useAdmin } from 'src/services/useAdmin'
import { LAYOUT_MAKE_REQUEST } from 'src/store/actions'
import { EquipamentT } from 'src/store/Types'
import { ButtonGroup, Container, Text } from './style'

const RemoveConfirmation: React.FC<EquipamentT> = ({ id, equipamentName }) => {
  const { closeModal } = useModal()
  const { Loading } = useLoading()
  const { apiAdmin } = useAdmin()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const deleteModel = async () => {
    try {
      Loading.turnOn()
      setLoading(true)
      await apiAdmin.delete(`equipaments/${id}`)
      toast.success(`Equipamento ${equipamentName} excluída com sucesso!`)
      closeModal()
      dispatch({
        type: LAYOUT_MAKE_REQUEST,
        payload: {
          makeRequest: Math.random(),
        },
      })
    } catch (error) {
      exceptionHandle(
        error,
        `Ops, Houve um erro ao tentar excluir o equipamento ${equipamentName}, atualize a página e tente novamente.`,
      )
    } finally {
      Loading.turnOff()
      setLoading(false)
    }
  }

  return (
    <Container>
      <Text>Deseja realmente excluir o equipamento</Text>
      <Text bold>{equipamentName} ?</Text>
      <ButtonGroup>
        <Button
          textButton="Deletar"
          variant="outlined"
          color="error"
          icon="delete"
          onClick={() => deleteModel()}
          loading={loading}
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
