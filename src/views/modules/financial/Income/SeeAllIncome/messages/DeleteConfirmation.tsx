import React, { useState } from 'react'
import { Button } from 'src/components'
import { toast } from 'src/components/Widgets/Toastify'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { useAdmin } from 'src/services/useAdmin'
import {
  UpdateConfirmationContainer, UpdateDeleteConfirmationContainer
} from './style'

type DeleteConfirmationProps = {
  osNumber: number
  valueFormated: string
  clientName: string
  id: string
  setMakeRequest: React.Dispatch<React.SetStateAction<number>>
  idFileCreatedGoogleDrive?: string
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  clientName,
  id,
  osNumber,
  valueFormated,
  setMakeRequest,
  idFileCreatedGoogleDrive,
}) => {
  const { closeModal } = useModal()
  const { apiAdmin } = useAdmin()
  const { Loading } = useLoading()
  const [loading, setLoading] = useState(false)

  const confirmation = async () => {
    try {
      Loading.turnOn()
      setLoading(true)
      await apiAdmin.delete(`orderServices/${id}/${idFileCreatedGoogleDrive}`)
      setMakeRequest(Math.random())
      toast.success('Receita financeira excluída com sucesso.')
    } catch (error) {
      toast.error(
        'Opss! Ocorreu um erro ao tentar excluir o registro financeiro.',
      )
      setMakeRequest(Math.random())
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
    <UpdateConfirmationContainer>
      <div>Deseja realmente excluir essa receita?</div>
      {clientName && <div>Cliente: {clientName}</div>}
      <div>Valor: {valueFormated}</div>
      {osNumber && <div>
        Ao clicar em SIM a ordem de serviço de Nº {osNumber} também será
        excluída do sistema.
      </div>}
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
