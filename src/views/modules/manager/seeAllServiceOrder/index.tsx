/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { exceptionHandle } from 'src/helpers/exceptions'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { socket } from 'src/services/Socket'
import { EVENT_UPDATE_OS_ORCAMENTO } from 'src/services/Socket/EventTypes'
import { useAdmin } from 'src/services/useAdmin'
import {
  EQUIPAMENT_SEE_ALL,
  PIECE_SEE_ALL,
  SERVICE_ORDER_SEE_ALL,
  SERVICE_SEE_ALL
} from 'src/store/actions'
import { IStore } from 'src/store/Types'
import useLocalStorage from 'use-local-storage'
import { fromApi } from '../../administration/services/adapters'
import { OSData } from '../serviceOrder/create/type'
import Filters from './filters'
import { ModalPDF } from './messages/ModalPDF'
import TableView from './Table'

type Props = {}

const SeeAllServiceOrder = (props: Props) => {
  const dispatch = useDispatch()
  const { apiAdmin } = useAdmin()
  const { Loading } = useLoading()
  const { showMessage, showSimple } = useModal()
  const [isOpenModalInformation, setIsOpenModalInformation] = useState(false)
  const serviceOrderFiltered = useSelector(
    (state: IStore) => state.serviceOrder.serviceOrderFilter,
  )
  const serviceOrdersStore = useSelector(
    (state: IStore) => state.serviceOrder.serviceOrders,
  )
  const [dataListTable, setDataListTable] = useState<OSData[]>([] as OSData[])
  const makeRequest = useSelector((state: IStore) => state.layout.makeRequest)
  const [selectedAllRowIds, setSelectedAllRowIds] = useState<string[]>(
    [] as string[],
  )
  const [oSData, setOSData] = useLocalStorage<OSData[]>(
    'oSData',
    [] as OSData[],
  )

  const getServices = async () => {
    try {
      const response = await apiAdmin.get(`services`, {
        params: {
          description: undefined,
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
    }
  }

  const getPieces = async () => {
    try {
      const response = await apiAdmin.get(`pieces`, {
        params: {
          description: undefined,
        },
      })
      dispatch({
        type: PIECE_SEE_ALL,
        payload: await fromApi(response),
      })
    } catch (error) {
      exceptionHandle(
        error,
        'Ops! Houve um erro ao tentar buscar as peças, atualize a página e tente novamente.',
      )
    }
  }

  const getEquipaments = async () => {
    try {
      const response = await apiAdmin.get(`equipaments`, {
        params: {
          equipamentName: undefined,
          brand: undefined,
          model: undefined,
          serialNumber: undefined,
        },
      })
      dispatch({
        type: EQUIPAMENT_SEE_ALL,
        payload: await fromApi(response),
      })
    } catch (error) {
      exceptionHandle(
        error,
        'Ops! Houve um erro ao tentar buscar os equipamentos, atualize a página e tente novamente.',
      )
    }
  }
  const getOrderServices = async () => {
    try {
      Loading.turnOn()
      const response = await apiAdmin.get(`orderServices`, {
        params: {
          clientName: undefined,
          osNumber: undefined,
        },
      })
      dispatch({
        type: SERVICE_ORDER_SEE_ALL,
        payload: await fromApi(response),
      })
    } catch (error) {
      exceptionHandle(
        error,

        'Ops! Houve um erro ao tentar buscar os equipamentos, atualize a página e tente novamente.',
      )
    } finally {
      Loading.turnOff()
    }
  }

  const onHandleGeneratePDF = async (id: string) => {
    try {
      Loading.turnOn()
      const { data } = await apiAdmin.get(`orderServices/${id}`)
      setOSData((previousState) => [...previousState, data])
    } catch (error) {
      exceptionHandle(
        error,
        'Opss! Houve um erro ao tentar gerar a Ordem de Serviço.',
      )
    } finally {
      Loading.turnOff()
    }
  }

  const checkArrayDistinct = (array: string[]): boolean => {
    const distinctValues = new Set(array);
    return distinctValues.size !== 1;
  };

  const checkIfTheSameClientOnSameOS = (osData: OSData[]) => {
    const clients: string[] = []
    osData.forEach((os) => {
      clients.push(os.client.id)
    })
    return checkArrayDistinct(clients)
  }

  const onHandleGenerateOS = async () => {
    setOSData([])
    let index = 0
    for (index; index < selectedAllRowIds.length; index++) {
      const item = selectedAllRowIds[index]
      await onHandleGeneratePDF(item)
      if (index === selectedAllRowIds.length - 1) {
        const data = JSON.parse(window.localStorage.getItem('oSData'))
        if (checkIfTheSameClientOnSameOS(data)) {
          showSimple.warning('Para unificar selecione o mesmo cliente.')
          return
        }
        showMessage(ModalPDF, { oSData: data })
        setIsOpenModalInformation(true)
      }
    }
  }

  const functions = () => {
    getOrderServices()
    getServices()
    getPieces()
    getEquipaments()
  }

  useEffect(() => {
    getServices()
    getPieces()
    getEquipaments()
    scroll(0, 0)
  }, [])

  useEffect(() => {
    functions()
    socket.on(EVENT_UPDATE_OS_ORCAMENTO, (data: string) => {
      /**
       * @description
       * Esse Websocket irá ser executado quando houver uma atualização de algum registro da Ordem de Serviço/Orçamento
       */
      functions()
    })
  }, [makeRequest, serviceOrderFiltered])

  useEffect(() => {
    setDataListTable(serviceOrdersStore)
  }, [])

  return (
    <section>
      <Filters
        onHandleGenerateOS={onHandleGenerateOS}
        selectedAllRowIds={selectedAllRowIds}
        serviceOrdersStore={serviceOrdersStore}
        setDataListTable={setDataListTable}
      />
      <TableView
        setSelectedAllRowIds={setSelectedAllRowIds}
        setIsOpenModalInformation={setIsOpenModalInformation}
        isOpenModalInformation={isOpenModalInformation}
        serviceOrdersStore={dataListTable}
      />
    </section>
  )
}

export default SeeAllServiceOrder
