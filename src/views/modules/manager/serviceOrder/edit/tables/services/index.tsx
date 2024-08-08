import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Autocomplete,
  AutocompleteOptions
} from 'src/components/Form/Autocomplete'
import { useAdmin } from 'src/services/useAdmin'
import { IStore, ServiceT } from 'src/store/Types'
import { useStateLaudoTech } from './hooks/StatesLaudoTech'

const TableView: React.FC = () => {
  const serviceOrdersStore = useSelector(
    (state: IStore) => state.serviceOrder.serviceOrders,
  )
  const [optionService, setOptionService] = useState<AutocompleteOptions[]>(
    [] as AutocompleteOptions[],
  )

  const { apiAdmin } = useAdmin()

  const { statesLaudoTech, state } = useStateLaudoTech()

  useEffect(() => {
    let cancel: any

    const loadService = async () => {
      try {
        const { data } = await apiAdmin.get(`brands`, {
          params: {
            description:
              (state.valueLaudoTech01.value === 0 &&
                state.valueLaudoTech01.label) ||
              undefined ||
              (state.valueLaudoTech02.value === 0 &&
                state.valueLaudoTech02.label) ||
              undefined ||
              (state.valueLaudoTech03.value === 0 &&
                state.valueLaudoTech03.label) ||
              undefined ||
              (state.valueLaudoTech04.value === 0 &&
                state.valueLaudoTech04.label) ||
              undefined ||
              (state.valueLaudoTech05.value === 0 &&
                state.valueLaudoTech05.label) ||
              undefined ||
              (state.valueLaudoTech06.value === 0 &&
                state.valueLaudoTech06.label) ||
              undefined ||
              (state.valueLaudoTech07.value === 0 &&
                state.valueLaudoTech07.label) ||
              undefined ||
              (state.valueLaudoTech08.value === 0 &&
                state.valueLaudoTech08.label) ||
              undefined ||
              (state.valueLaudoTech09.value === 0 &&
                state.valueLaudoTech09.label) ||
              undefined,
          },

          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        })

        const dataMapped = data?.map((val: ServiceT) => ({
          value: val._id,
          label: val.description,
        }))

        setOptionService(dataMapped)
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message)
        }
      }
    }

    loadService()

    return () => cancel && cancel()
  }, [
    state.valueLaudoTech01.label,
    state.valueLaudoTech02.label,
    state.valueLaudoTech03.label,
    state.valueLaudoTech04.label,
    state.valueLaudoTech05.label,
    state.valueLaudoTech06.label,
    state.valueLaudoTech07.label,
    state.valueLaudoTech08.label,
    state.valueLaudoTech09.label,
  ])

  const onHandleClickAutoComplete = (key: number | string) => {
    const element = document.querySelectorAll('#tableService tr')
    if (key === 5 || key === 6 || key === 7 || key === 8 || key === 9) {
      element[9].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small" id="tableService">
        <TableHead>
          <div style={{ margin: '20px', fontWeight: 'bold', fontSize: '16px' }}>
            <div>Serviços Executados</div>
          </div>
          <TableRow></TableRow>
        </TableHead>
        <TableBody>
          {statesLaudoTech().map((state, key) => {
            return (
              <TableRow key={key}>
                <Autocomplete
                  value={state.field}
                  setValue={state.setField}
                  options={optionService}
                  setOptions={setOptionService}
                  onClick={() => onHandleClickAutoComplete(key)}
                />
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableView
