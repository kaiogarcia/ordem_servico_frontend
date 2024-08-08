/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { exceptionHandle } from 'src/helpers/exceptions'
import { useLoading } from 'src/hooks/useLoading'
import { SERVICE_FILTER, SERVICE_SEE_ALL } from 'src/store/actions'
import { IStore } from 'src/store/Types'
import { useAdmin } from '../../../../services/useAdmin'
import { fromApi } from './adapters'
import Filters from './filters'
import { Container } from './styles'
import Table from './Table'

const Service: React.FC = () => {
  const { apiAdmin } = useAdmin()

  const dispatch = useDispatch()
  const { Loading } = useLoading()

  const serviceFiltered = useSelector(
    (state: IStore) => state.service.serviceFilter,
  )

  const makeRequest = useSelector((state: IStore) => state.layout.makeRequest)

  const getServices = async () => {
    try {
      Loading.turnOn()
      const response = await apiAdmin.get(`services`, {
        params: {
          description: serviceFiltered.description || undefined,
        },
      })
      dispatch({
        type: SERVICE_SEE_ALL,
        payload: await fromApi(response),
      })
    } catch (error) {
      exceptionHandle(
        error,
        'Ops! Houve um erro ao tentar buscar os servicos, atualize a página e tente novamente.',
      )
    } finally {
      Loading.turnOff()
    }
  }

  useEffect(() => {
    getServices()
    scroll(0, 0)
  }, [serviceFiltered, makeRequest])

  useEffect(() => {
    return () => {
      dispatch({
        type: SERVICE_FILTER,
        payload: {
          description: undefined,
          value: undefined,
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

export default Service
