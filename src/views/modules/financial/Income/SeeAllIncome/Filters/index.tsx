/* eslint-disable react-hooks/exhaustive-deps */
import { Paper } from '@mui/material'
import { format, getYear, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button } from 'src/components'
import InputText from 'src/components/Form/InputText/index_old'
import { toast } from 'src/components/Widgets/Toastify'
import hasNumber from 'src/helpers/hasNumber'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { socket } from 'src/services/Socket'
import { EVENT_UPDATE_OS_ORCAMENTO } from 'src/services/Socket/EventTypes'
import { useAdmin } from 'src/services/useAdmin'
import { IStore } from 'src/store/Types'
import { Row } from 'src/styles'
import useLocalStorage from 'use-local-storage'
import { Income, MonthAndYear, fromApi } from '../Table/adapter'
import { NewIncome } from '../messages/NewIncome'
import { Container, Form } from './style'

type SeeAllIncomeProps = {
  nameOrOsNumber: string
}

type FiltersProps = {
  setIncomesFiltered: React.Dispatch<React.SetStateAction<Income[]>>
  makeRequest: number
  setMakeRequest: React.Dispatch<React.SetStateAction<number>>
}

const Filters: React.FC<FiltersProps> = ({
  setIncomesFiltered,
  makeRequest,
  setMakeRequest
}) => {
  const { control, handleSubmit, getValues, watch } =
    useForm<SeeAllIncomeProps>()
  const { showMessage } = useModal()
  const { apiAdmin } = useAdmin()
  const [months, setMonths] = useState([])
  const [monthSelected, setMonthSelected] = useState('')
  const [years, setYears] = useState([])
  const [yearSelected, setYearSelected] = useState('')
  const [monthAndYear, setMonthAndYear] = useState<MonthAndYear[]>([] as MonthAndYear[])
  const [incomes, setIncomes] = useState<Income[]>([] as Income[])
  const { Loading } = useLoading()
  const history = useHistory()
  const [selectedButton, setSelectedButton] = useLocalStorage(
    'selectedButton',
    'PENDENTE',
  )
  const nameOrOsNumber = watch('nameOrOsNumber')
  const [isUsingLoading, setIsUsingLoading] = useState(true)
  const makeRequestGlobal = useSelector((state: IStore) => state.layout.makeRequest)

  const onSubmitIncome = (nameOrOsNumber: SeeAllIncomeProps) => {
    // const result = dateFilter(`${monthSelected}/${yearSelected}`, incomes)
    // setIncomesFiltered(result)
  }

  const checkIfbuttonHasSelected = (dataIncomeResponseFromApi: Income[], monthAndYear: MonthAndYear[]) => {
    const { monthSelected, yearSelected } = getDateCurrent(monthAndYear)
    if (monthSelected && yearSelected) {
      const result = dateFilter(
        `${monthSelected}/${yearSelected}`,
        dataIncomeResponseFromApi,
        !selectedButton ? 'PENDENTE' : selectedButton,
      )
      setIncomesFiltered(result)
    } else {
      setIncomesFiltered(dataIncomeResponseFromApi)
    }
  }

  const getDataOrderServices = async () => {
    try {
      if (isUsingLoading) {
        Loading.turnOn()
      }
      const { data } = await apiAdmin.get('orderServices')
      const { resultFromApi, orderedMonth, orderedYear, monthAndYear } = fromApi(data)
      setMonths(orderedMonth)
      setYears(orderedYear)
      setIncomes(resultFromApi)
      checkIfbuttonHasSelected(resultFromApi, monthAndYear)
      setSelectedButton(selectedButton)
      setMonthAndYear(monthAndYear)
      // const result = dateFilter(
      //   `${monthSelected}/${yearSelected}`,
      //   resultFromApi,
      //   selectedButton,
      // )
      // setIncomesFiltered(result)
    } catch (error) {
      console.log(error)
      toast.error('Um erro ocurreu ao tentar buscar os dados de receitas')
    } finally {
      if (isUsingLoading) {
        Loading.turnOff()
      }
      setIsUsingLoading(true)
    }
  }

  const onHandleClickYear = (year: string) => {
    if (monthAndYear?.length) {
      setMonths(monthAndYear.filter((item) => item.year === year).map((item) => item.month))
    }
    setYearSelected(year)
    const result = dateFilter(
      `${monthSelected}/${year}`,
      incomes,
      selectedButton,
    )
    setIncomesFiltered(result)
  }

  const onHandleClickMonth = (month: string) => {
    if (!yearSelected) {
      toast.error('Selecione o ano.')
      return
    }
    setMonthSelected(month)
    const result = dateFilter(
      `${month}/${yearSelected}`,
      incomes,
      selectedButton,
    )
    setIncomesFiltered(result)
  }

  function getDateCurrent(monthAndYear?: MonthAndYear[]) {
    const currentMonth = format(new Date(), 'MMM', {
      locale: ptBR,
    }).toUpperCase()
    const currentYear = String(getYear(new Date()))
    setMonthSelected(currentMonth)
    setYearSelected(currentYear)
    setSelectedButton(!selectedButton ? 'PENDENTE' : selectedButton)
    if (monthAndYear?.length) {
      setMonths(monthAndYear.filter((item) => item.year === currentYear).map((item) => item.month))
    }
    return {
      monthSelected: currentMonth,
      yearSelected: currentYear,
    }
  }

  const onHandleSituation = (situation: string) => {
    setSelectedButton(situation)
    const result = dateFilter(
      `${monthSelected}/${yearSelected}`,
      incomes,
      situation,
    )
    setIncomesFiltered(result)
  }

  function dateFilter(
    data: string,
    arrayDatas: Income[],
    situation?: string,
    income?: string,
  ): any[] {
    try {
      Loading.turnOn()
      const valuesFields = getValues()
      const [monthFind, yearFind] = data.split('/')
      const dataPesquisa = parse(
        `${monthFind}/${yearFind}`,
        'MMM/yyyy',
        new Date(),
        { locale: ptBR },
      )
      return arrayDatas.filter((data) => {
        const dataDado = parse(data?.dateClientPayment || data.dateOS, 'dd/MM/yyyy', new Date())
        if (!income) {
          return (
            dataDado.getMonth() === dataPesquisa.getMonth() &&
            dataDado.getFullYear() === dataPesquisa.getFullYear() &&
            data.situation === situation
          )
        } else {
          if (hasNumber(valuesFields?.nameOrOsNumber)) {
            return (
              data.osNumber.trim() === income?.trim() &&
              data.situation === situation
            )
          } else {
            return (
              dataDado.getMonth() === dataPesquisa.getMonth() &&
              dataDado.getFullYear() === dataPesquisa.getFullYear() &&
              data.situation === situation &&
              data.clientName
                ?.toUpperCase()
                .trim()
                .includes(income?.toUpperCase()?.trim())
            )
          }
        }
      })
      // .filter((item) =>
      //   item.osNumber
      //     .toUpperCase()
      //     .trim()
      //     .includes(valuesFields?.nameOrOsNumber?.toUpperCase().trim()),
      // )
      // .filter((item) =>
      //   income
      //     ? item.clientName
      //         .toUpperCase()
      //         .trim()
      //         .includes(income?.toUpperCase().trim())
      //     : item,
      // )
      // .filter((item) => (situation ? item.situation === situation : item))
    } catch (err) {
      toast.error('Ocorreu um erro ao realizar a filtragem dos dados.')
    } finally {
      Loading.turnOff()
    }
  }

  const onHandleNewIncome = () => {
    showMessage(NewIncome, { setMakeRequest, history }, true)
  }

  useEffect(() => {
    getDataOrderServices()
    socket.on(EVENT_UPDATE_OS_ORCAMENTO, (data: string) => {
      setIsUsingLoading(false)
      /**
       * @description
       * Esse Websocket irá ser executado quando houver uma atualização de algum registro da Ordem de Serviço/Orçamento
       */
      getDataOrderServices()
    })
  }, [makeRequest, makeRequestGlobal])

  useEffect(() => {
    const result = dateFilter(
      `${monthSelected}/${yearSelected}`,
      incomes,
      selectedButton,
      nameOrOsNumber,
    )
    setIncomesFiltered(result)
  }, [nameOrOsNumber])

  useEffect(() => {
    return () => {
      window.localStorage.removeItem('selectedButton')
    }
  }, [])

  return (
    <>
      {!!incomes.length && (
        <Paper elevation={1}>
          <Container>
            <Row display="flex" flexDirection="column" gap={1}>
              <div>Ano:</div>
              <Row
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                gap={2}
              >
                {years.map((year, index) => (
                  <Button
                    variant={yearSelected === year ? 'contained' : 'outlined'}
                    textButton={year}
                    onClick={() => onHandleClickYear(year)}
                  />
                ))}
              </Row>
            </Row>
            <Row display="flex" flexDirection="column" gap={1}>
              <div>Mês:</div>
              <Row
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                gap={2}
              >
                {months.map((month) => (
                  <Button
                    variant={monthSelected === month ? 'contained' : 'outlined'}
                    textButton={month}
                    onClick={() => onHandleClickMonth(month)}
                  />
                ))}
              </Row>
            </Row>
            <Row display="flex" flexDirection="column" gap={1}>
              <div>Situação:</div>
              <Row
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                gap={2}
              >
                <Button
                  variant={
                    selectedButton === 'PENDENTE' ? 'contained' : 'outlined'
                  }
                  textButton="Pendentes a Receber"
                  color="warning"
                  onClick={() => onHandleSituation('PENDENTE')}
                />
                <Button
                  variant={selectedButton === 'PAGO' ? 'contained' : 'outlined'}
                  textButton="Recebidos"
                  color="success"
                  onClick={() => onHandleSituation('PAGO')}
                />
              </Row>
            </Row>
            <Row display="flex" flexDirection="column" gap={1}>
              <Form onSubmit={handleSubmit(onSubmitIncome)} autoComplete="off">
                <Row display="grid" columns="1fr" alignItems="end" gap={10}>
                  <Controller
                    name="nameOrOsNumber"
                    control={control}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                      <InputText
                        label="Cliente/Nº O.S:"
                        field={field}
                        fieldState={fieldState}
                      />
                    )}
                  />
                </Row>
              </Form>
            </Row>
            <Row columns='1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr' gap={1}>
              <Button
                variant={'outlined'}
                textButton={'Incluir'}
                color="primary"
                icon="add"
                onClick={onHandleNewIncome}
              />
            </Row>
          </Container>
        </Paper>
      )}
    </>
  )
}

export default Filters
