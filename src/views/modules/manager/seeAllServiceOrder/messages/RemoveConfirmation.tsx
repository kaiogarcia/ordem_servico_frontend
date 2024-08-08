import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Button from 'src/components/Form/Button'
import { toast } from 'src/components/Widgets/Toastify'
import { exceptionHandle } from 'src/helpers/exceptions'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { useAdmin } from 'src/services/useAdmin'
import { LAYOUT_MAKE_REQUEST } from 'src/store/actions'
import { MappedDataServiceOrders } from '../types'
import { ButtonGroup, Container, Text } from './style'

const RemoveConfirmation: React.FC<MappedDataServiceOrders> = ({
  id,
  osNumber,
  name,
  total,
  typeDocument,
  idFileCreatedGoogleDrive,
}) => {
  const { closeModal } = useModal()
  const { Loading } = useLoading()
  const { apiAdmin } = useAdmin()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const deleteModel = async () => {
    try {
      Loading.turnOn()
      setLoading(true)
      await apiAdmin.delete(`orderServices/${id}/${idFileCreatedGoogleDrive}`)
      toast.success(`${getTypeDocument(typeDocument)} de nº ${osNumber} excluída com sucesso!`)
      dispatch({
        type: LAYOUT_MAKE_REQUEST,
        payload: {
          makeRequest: Math.random(),
        },
      })
    } catch (error) {
      exceptionHandle(
        error,
        `Ops, Houve um erro ao tentar excluir ${getTypeDocument(typeDocument)} de nº ${osNumber}, atualize a página e tente novamente.`,
      )
    } finally {
      Loading.turnOff()
      setLoading(false)
      closeModal()
    }
  }

  const getTypeDocument = (typeDocument: string) => {
    if (typeDocument === 'ORDEM_DE_SERVICO') return 'Ordem de Serviço'
    if (typeDocument === 'ORCAMENTO') return 'Orçamento'
  }

  return (
    <Container>
      <Text alignSelf="center" fontSize="20px" bold>
        Deseja realmente excluir?
      </Text>
      <Text flexDirection="column">
        <div>
          {getTypeDocument(typeDocument)}: <span>{osNumber}</span>
        </div>
        <div>
          Cliente: <span>{name}</span>
        </div>
        <div>
          Total: <span>{total}</span>
        </div>
      </Text>
      <Text>
        Ao clicar em <span>SIM</span> a receita lançada no financeiro será
        excluída, essa operação não poderá ser desfeita.
      </Text>
      <ButtonGroup>
        <Button
          textButton="Sim"
          variant="outlined"
          color="error"
          icon="delete"
          onClick={() => deleteModel()}
          loading={loading}
        />
        <Button
          textButton="Não"
          variant="outlined"
          icon="close"
          onClick={() => closeModal()}
        />
      </ButtonGroup>
    </Container>
  )
}

export default RemoveConfirmation
