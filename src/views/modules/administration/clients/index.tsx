/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'src/components/Widgets/Toastify'
import { useLoading } from 'src/hooks/useLoading'
import { CLIENT_FILTER, CLIENT_SEE_ALL } from 'src/store/actions'
import { IStore } from 'src/store/Types'
import { useAdmin } from '../../../../services/useAdmin'
import { fromApi } from './adapters'
import Filters from './filters'
import { Container } from './styles'
import Table from './Table'

const Client: React.FC = () => {
  const { apiAdmin } = useAdmin()

  const dispatch = useDispatch()
  const { Loading } = useLoading()

  const clientFiltered = useSelector(
    (state: IStore) => state.client.clientFilter,
  )

  const makeRequest = useSelector((state: IStore) => state.layout.makeRequest)

  const getClients = async () => {
    try {
      Loading.turnOn()
      const response = await apiAdmin.get(`clients`, {
        params: {
          name: clientFiltered.name || undefined,
          cpfOrCnpj: clientFiltered.cpfOrCnpj || undefined,
          phoneNumber: clientFiltered.phoneNumber || undefined,
          address: clientFiltered.address || undefined,
          city: clientFiltered.city || undefined,
          uf: clientFiltered.uf || undefined,
        },
      })
      dispatch({
        type: CLIENT_SEE_ALL,
        payload: await fromApi(response),
      })
    } catch (error) {
      toast.error(
        'Ops! Houve um erro ao tentar buscar os clientes, atualize a página e tente novamente.',
      )
    } finally {
      Loading.turnOff()
    }
  }

  useEffect(() => {
    getClients()
    scroll(0, 0)
  }, [clientFiltered, makeRequest])

  useEffect(() => {
    return () => {
      dispatch({
        type: CLIENT_FILTER,
        payload: {
          name: undefined,
          cpfOrCnpj: undefined,
          phoneNumber: undefined,
          phoneNumberFixo: undefined,
          address: undefined,
          city: undefined,
          uf: undefined,
          withoutEmail: undefined
        },
      })
    }
  }, [])


  return (
    <Container>
      <Filters />
      <Table />
    </Container>
  )
}

export default Client
