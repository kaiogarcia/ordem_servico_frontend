import { Alert } from '@mui/material'
import React, { useState } from 'react'
import { Button } from 'src/components'
import { toast } from 'src/components/Widgets/Toastify'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { useAdmin } from 'src/services/useAdmin'
import {
  NewExpenseContainer,
  Text, UpdateDeleteConfirmationContainer
} from './style'

type UpdateConfirmationProps = {
  id: string
  expense_type: string
  valueFormated: string
  expense: string
  setMakeRequest: React.Dispatch<React.SetStateAction<number>>
}

export const UpdateConfirmationExpenseEmpresaPessoal: React.FC<UpdateConfirmationProps> = ({
  id,
  expense_type,
  valueFormated,
  expense,
  setMakeRequest,
}) => {
  const { closeModal } = useModal()
  const { apiAdmin } = useAdmin()
  const { Loading } = useLoading()
  const [loading, setLoading] = useState(false)

  const changeSituation = () => {
    return expense_type === 'Pessoal' ? 'Empresa' : 'Pessoal'
  }

  const confirmation = async () => {
    try {
      Loading.turnOn()
      setLoading(true)
      await apiAdmin.put(`expense/${id}`, { expense_type: changeSituation() })
      setTimeout(() => {
        setMakeRequest(Math.random())
        setLoading(false)
        toast.success('Receita financeira atualizada com sucesso.')
        closeModal()
        Loading.turnOff()
      }, 2000)
    } catch (error) {
      Loading.turnOff()
      closeModal()
      setLoading(false)
      toast.error(
        'Opss! Ocorreu um erro ao tentar atualiza o status do registro financeiro.',
      )
    }
  }

  const cancel = () => {
    closeModal()
  }

  return (
    <NewExpenseContainer>
      <Text fontSize='19px'>
        Deseja atualizar para Despesa <b style={{ marginLeft: '5px' }}>{changeSituation()}</b>?
      </Text>
      <p />
      <Alert severity="info">Despesa: {expense}</Alert>
      <Alert severity="info">Valor: {valueFormated}</Alert>
      <p />
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
    </NewExpenseContainer>
  )
}
