/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'src/components/Widgets/Toastify'
import { useLoading } from 'src/hooks/useLoading'
import { PIECE_FILTER, PIECE_SEE_ALL } from 'src/store/actions'
import { IStore } from 'src/store/Types'
import { useAdmin } from '../../../../services/useAdmin'
import { fromApi } from './adapters'
import Filters from './filters'
import { Container } from './styles'
import Table from './Table'

const Piece: React.FC = () => {
  const { apiAdmin } = useAdmin()

  const dispatch = useDispatch()
  const { Loading } = useLoading()

  const pieceFiltered = useSelector((state: IStore) => state.piece.pieceFilter)

  const makeRequest = useSelector((state: IStore) => state.layout.makeRequest)

  const getClients = async () => {
    try {
      Loading.turnOn()
      const response = await apiAdmin.get(`pieces`, {
        params: {
          description: pieceFiltered.description || undefined,
          //value: pieceFiltered.value || undefined,
        },
      })
      dispatch({
        type: PIECE_SEE_ALL,
        payload: await fromApi(response),
      })
    } catch (error) {
      toast.error(
        'Ops! Houve um erro ao tentar buscar as peças, atualize a página e tente novamente.',
      )
    } finally {
      Loading.turnOff()
    }
  }

  useEffect(() => {
    getClients()
    scroll(0, 0)
  }, [pieceFiltered, makeRequest])

  useEffect(() => {
    return () => {
      dispatch({
        type: PIECE_FILTER,
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

export default Piece
