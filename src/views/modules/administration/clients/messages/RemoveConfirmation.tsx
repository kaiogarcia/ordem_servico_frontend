import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Button from 'src/components/Form/Button'
import { toast } from 'src/components/Widgets/Toastify'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { useAdmin } from 'src/services/useAdmin'
import { ClientT } from 'src/store/Types'
import { LAYOUT_MAKE_REQUEST } from 'src/store/actions'
import { ButtonGroup, Container, Text } from './style'

const RemoveConfirmation: React.FC<ClientT> = ({ id, name, idFolderClientName }) => {
  const { closeModal } = useModal()
  const { Loading } = useLoading()
  const { apiAdmin } = useAdmin()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const deleteClient = async () => {
    try {
      setLoading(true)
      await apiAdmin.delete(`clients/${id}/${idFolderClientName}`)
      //await apiAdmin.delete(`orderServices/${id}`)
      toast.success(`Cliente ${name} excluído com sucesso!`)
      closeModal()
      dispatch({
        type: LAYOUT_MAKE_REQUEST,
        payload: {
          makeRequest: Math.random(),
        },
      })
    } catch (error) {
      toast.error(
        `Ops, Houve um erro ao tentar excluir o cliente ${name}, atualize a página e tente novamente.`,
      )
    } finally {
      Loading.turnOff()
      setLoading(false)
    }
  }

  return (
    <Container>
      <Text alignSelf="center" fontSize="20px" bold>Deseja realmente excluir o cliente?</Text>
      <Text flexDirection="column">
        <div>
          Cliente: <span>{name}</span>
        </div>
      </Text>
      {/* <Text style={{ color: 'red' }}>
        Ao clicar em <span>SIM</span> todas as Ordem de Serviços/Orçamentos vinculadas a esse cliente serão excluídas. Essa operação não poderá ser desfeita.
      </Text> */}
      <ButtonGroup>
        <Button
          textButton="Deletar"
          variant="outlined"
          color="error"
          icon="delete"
          onClick={() => deleteClient()}
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
