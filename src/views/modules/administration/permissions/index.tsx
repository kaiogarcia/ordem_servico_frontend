/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { exceptionHandle } from 'src/helpers/exceptions'
import { useLoading } from 'src/hooks/useLoading'
import { IStore } from 'src/store/Types'
import { useAdmin } from '../../../../services/useAdmin'
import { fromApi } from './adapter'
import Filters from './filters'
import { Container } from './styles'
import TableView from './Table'
import { User } from './type'

const Permissions: React.FC = () => {

  const { apiAdmin } = useAdmin()
  /**
   * Nome completo
   * E-mail
   * CPF
   * Senha > Gerar de forma randomica em número com 4 digitos.
   */


  const dispatch = useDispatch()
  const { Loading } = useLoading()
  const [users, setUsers] = useState<User[]>([] as User[])

  const [userFiltered, setUserFiltered] = useState<User>({} as User)

  const makeRequest = useSelector((state: IStore) => state.layout.makeRequest)

  const getEquipaments = async () => {
    try {
      Loading.turnOn()
      const { data } = await apiAdmin.get(`users`, {
        params: {
          name: userFiltered?.name || undefined,
        },
      })
      setUsers(fromApi(data))
    } catch (error) {
      exceptionHandle(
        error,
        'Ops! Houve um erro ao tentar buscar as marcas, atualize a página e tente novamente.',
      )
    } finally {
      Loading.turnOff()
    }
  }

  useEffect(() => {
    getEquipaments()
    scroll(0, 0)
  }, [userFiltered, makeRequest])

  return (
    <Container>
      <Filters setUserFiltered={setUserFiltered} />
      <TableView users={users} />
    </Container>
  )
}

export default Permissions
