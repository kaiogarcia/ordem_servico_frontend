import Alert from '@mui/material/Alert'
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
  valueFormated: string
  expense: string
  id: string
  situation: string
  setMakeRequest: React.Dispatch<React.SetStateAction<number>>
}

export const UpdateConfirmation: React.FC<UpdateConfirmationProps> = ({
  expense,
  id,
  valueFormated,
  situation,
  setMakeRequest,
}) => {
  const { closeModal } = useModal()
  const { apiAdmin } = useAdmin()
  const { Loading } = useLoading()
  const [loading, setLoading] = useState(false)

  const changeSituation = () => {
    return situation === 'A PAGAR' ? 'PAGO' : 'A PAGAR'
  }

  const confirmation = async () => {
    try {
      Loading.turnOn()
      setLoading(true)
      await apiAdmin.put(`expense/${id}`, { status: changeSituation() })
      setMakeRequest(Math.random())
      toast.success('Despesa financeira atualizada com sucesso.')
    } catch (error) {
      toast.error(
        'Opss! Ocorreu um erro ao tentar atualiza o status do registro financeiro.',
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
    <NewExpenseContainer>
      <Text>
        Deseja atualizar o status desse registro para <b style={{ marginLeft: '5px' }}>{changeSituation()}</b>?
      </Text>
      <p />
      <Alert severity="info">Despesa: {expense}</Alert>
      <Alert severity="info">Valor: {valueFormated}</Alert>
      {/* <Alert severity="warning">
        <b>Ao clicar em SIM o procedimento não poderá ser desfeito.</b>
      </Alert> */}
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
