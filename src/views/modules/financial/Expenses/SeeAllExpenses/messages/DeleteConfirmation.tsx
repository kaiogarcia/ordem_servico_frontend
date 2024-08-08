import React, { useState } from 'react'
import { Button } from 'src/components'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { useAdmin } from 'src/services/useAdmin'
import {
  UpdateDeleteConfirmationContainer,
  DeleteConfirmationContainer,
  Text,
} from './style'
import { toast } from 'src/components/Widgets/Toastify'
import Alert from '@mui/material/Alert'

type DeleteConfirmationProps = {
  id: string
  valueFormated: string
  expense: string
  status: string
  setMakeRequest: React.Dispatch<React.SetStateAction<number>>
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  id,
  valueFormated,
  expense,
  status,
  setMakeRequest,
}) => {
  const { closeModal } = useModal()
  const { apiAdmin } = useAdmin()
  const { Loading } = useLoading()
  const [loading, setLoading] = useState(false)

  const confirmation = async () => {
    try {
      Loading.turnOn()
      setLoading(true)
      await apiAdmin.delete(`expense/${id}`)
      setMakeRequest(Math.random())
      toast.success('Despesa financeira excluída com sucesso.')
    } catch (error) {
      toast.error(
        'Opss! Ocorreu um erro ao tentar excluir o registro financeiro.',
      )
    } finally {
      Loading.turnOff()
      closeModal()
      setLoading(false)
    }
  }

  const cancel = () => {
    closeModal()
  }

  return (
    <DeleteConfirmationContainer>
      <Text>
        <Alert severity="warning">
          Deseja realmente <b>excluir</b> essa despesa?
        </Alert>
      </Text>
      <p />
      <Alert severity="info">Despesa: {expense}</Alert>
      <Alert severity="info">Valor: {valueFormated}</Alert>
      <Alert severity="info">
        Status: <b>{status}</b>
      </Alert>
      <UpdateDeleteConfirmationContainer>
        <Button
          textButton="Sim"
          variant="outlined"
          size="large"
          icon="add2"
          onClick={confirmation}
          loading={loading}
        />
        <Button
          textButton="Não"
          variant="outlined"
          size="large"
          icon="close"
          color="error"
          onClick={cancel}
        />
      </UpdateDeleteConfirmationContainer>
    </DeleteConfirmationContainer>
  )
}
