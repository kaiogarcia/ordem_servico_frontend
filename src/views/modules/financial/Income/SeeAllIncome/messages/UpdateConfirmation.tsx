import React, { useState } from 'react'
import { Button } from 'src/components'
import { toast } from 'src/components/Widgets/Toastify'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { useAdmin } from 'src/services/useAdmin'
import {
  UpdateConfirmationContainer, UpdateDeleteConfirmationContainer
} from './style'

type UpdateConfirmationProps = {
  valueFormated: string
  clientName: string
  id: string
  situation: string
  description: string
  setMakeRequest: React.Dispatch<React.SetStateAction<number>>
}

export const UpdateConfirmation: React.FC<UpdateConfirmationProps> = ({
  clientName,
  id,
  valueFormated,
  situation,
  description,
  setMakeRequest,
}) => {
  const { closeModal } = useModal()
  const { apiAdmin } = useAdmin()
  const [loading, setLoading] = useState(false)
  const { Loading } = useLoading()

  const changeSituation = () => {
    return situation === 'PENDENTE' ? 'RECEBIDO' : 'PENDENTE'
  }

  const changeSituationToApi = () => {
    return situation === 'PENDENTE' ? 'PAGO' : 'PENDENTE'
  }

  const confirmation = async () => {
    try {
      Loading.turnOn()
      setLoading(true)
      apiAdmin.put(`orderServices/${id}`, { status: changeSituationToApi() })
      setTimeout(() => {
        setMakeRequest(Math.random())
        setLoading(false)
        toast.success('Receita financeira atualizada com sucesso.')
        closeModal()
        Loading.turnOff()
      }, 2000)
    } catch (error) {
      setLoading(false)
      closeModal()
      Loading.turnOff()
      toast.error(
        'Opss! Ocorreu um erro ao tentar atualiza o status do registro financeiro.',
      )
    }
  }

  const cancel = () => {
    closeModal()
  }

  return (
    <UpdateConfirmationContainer>
      <div>
        Deseja atualizar esse registro financeiro para
        <b>{changeSituation()}</b>?
      </div>
      <p />
      {clientName && <div><b>Cliente:</b> {String(clientName).toUpperCase()}</div>}
      {description && <div><b>Receita:</b> {String(description).toUpperCase()}</div>}
      <div><b>Valor:</b> {valueFormated}</div>
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
    </UpdateConfirmationContainer>
  )
}
