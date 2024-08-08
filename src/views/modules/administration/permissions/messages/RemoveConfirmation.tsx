import React from 'react'
import { useDispatch } from 'react-redux'
import Button from 'src/components/Form/Button'
import { toast } from 'src/components/Widgets/Toastify'
import { exceptionHandle } from 'src/helpers/exceptions'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { useAdmin } from 'src/services/useAdmin'
import { LAYOUT_MAKE_REQUEST } from 'src/store/actions'
import { User } from '../type'
import { ButtonGroup, Container, Text } from './style'

const UpdateInactiveConfirmation: React.FC<User> = ({ id, name, status }) => {
  const { closeModal } = useModal()
  const { Loading } = useLoading()
  const { apiAdmin } = useAdmin()
  const dispatch = useDispatch()

  const deleteModel = async () => {
    try {
      Loading.turnOn()
      await apiAdmin.put(`users/update/status/${id}`, {
        status: status === 'ATIVO' ? 'BLOQUEADO' : 'ATIVO'
      })
      if (status === 'ATIVO') {
        toast.success(`Usuário ${name} bloqueado com sucesso!`)
      } else {
        toast.success(`Usuário ${name} ativado com sucesso!`)
      }
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
        `Ops, Houve um erro ao tentar ${status === 'ATIVO' ? 'BLOQUEAR' : 'ATIVAR'} o usuário ${name}, atualize a página e tente novamente.`,
      )
    } finally {
      Loading.turnOff()
    }
  }

  return (
    <Container>
      <Text>Deseja realmente <b>{status === 'ATIVO' ? 'BLOQUEAR' : 'ATIVAR'}</b> o usuário <b>{name}</b> ?</Text>
      <ButtonGroup>
        <Button
          textButton="Confirmar"
          variant="outlined"
          color="error"
          icon="update2"
          onClick={() => deleteModel()}
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

export default UpdateInactiveConfirmation
