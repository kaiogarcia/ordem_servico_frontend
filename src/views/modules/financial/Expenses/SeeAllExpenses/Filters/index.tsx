/* eslint-disable react-hooks/exhaustive-deps */
import { Paper } from '@mui/material'
import { format, getYear, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { Button } from 'src/components'
import InputText from 'src/components/Form/InputText/index_old'
import { toast } from 'src/components/Widgets/Toastify'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { usePermission } from 'src/hooks/usePermission'
import { useAdmin } from 'src/services/useAdmin'
import { Row } from 'src/styles'
import { DESPESAS_INCLUIR } from 'src/views/modules/administration/permissions/static/keysPermissions'
import useLocalStorage from 'use-local-storage'
import { Expense, MonthAndYear, fromApi } from '../Table/adapter'
import { NewExpenses } from '../messages/NewExpenses'
import UploadDocument from '../messages/UploadDocument'
import { Container, Form } from './style'

type SeeAllIncomeProps = {
  expense: string
}

type FiltersProps = {
  setIncomesFiltered: React.Dispatch<React.SetStateAction<Expense[]>>
  makeRequest: number
  setMakeRequest: React.Dispatch<React.SetStateAction<number>>
}

const Filters: React.FC<FiltersProps> = ({
  setIncomesFiltered,
  makeRequest,
  setMakeRequest,
}) => {
  const { control, handleSubmit, getValues, watch } =
    useForm<SeeAllIncomeProps>()
  const { hasPermission } = usePermission()
  const { apiAdmin } = useAdmin()
  const { showMessage } = useModal()
  const [months, setMonths] = useState([])
  const [monthSelected, setMonthSelected] = useState('')
  const [years, setYears] = useState([])
  const [yearSelected, setYearSelected] = useState('')
  const [incomes, setIncomes] = useState<Expense[]>([] as Expense[])
  const [monthAndYear, setMonthAndYear] = useState<MonthAndYear[]>([] as MonthAndYear[])
  const { Loading } = useLoading()
  const history = useHistory()
  const [selectedButton, setSelectedButton] = useLocalStorage(
    'selectedButtonExpense',
    'PAGO',
  )
  const expense = watch('expense')

  const onSubmitIncome = (nameOrOsNumber: SeeAllIncomeProps) => {
    // const result = dateFilter(`${monthSelected}/${yearSelected}`, incomes)
    // setIncomesFiltered(result)
  }

  const checkIfbuttonHasSelected = async (dataIncomeResponseFromApi: Expense[], monthAndYear: MonthAndYear[]) => {
    const { monthSelected, yearSelected } = getDateCurrent(monthAndYear)
    if (monthSelected && yearSelected) {
      const result = dateFilter(
        `${monthSelected}/${yearSelected}`,
        dataIncomeResponseFromApi,
        !selectedButton ? 'A PAGAR' : selectedButton,
      )
      setIncomesFiltered(result)
    } else {
      setIncomesFiltered(dataIncomeResponseFromApi)
    }
  }

  const getDataOrderServices = async () => {
    try {
      Loading.turnOn()
      const { data: dataExpense } = await apiAdmin.get('expense')
      const { data: dataPieces } = await apiAdmin.get('pieces')
      const { resultFromApi, orderedYear, monthAndYear } = fromApi(
        dataExpense,
        dataPieces,
      )
      //setMonths(orderedMonth)
      setMonthAndYear(monthAndYear)
      setYears(orderedYear)
      setIncomes(resultFromApi)
      await checkIfbuttonHasSelected(resultFromApi, monthAndYear)
    } catch (error) {
      toast.error('Um erro ocurreu ao tentar buscar os dados de receitas')
    } finally {
      Loading.turnOff()
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
    setSelectedButton(!selectedButton ? 'A PAGAR' : selectedButton)
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
    arrayDatas: Expense[],
    situation?: string,
    expense?: string,
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
      return arrayDatas
        .filter((dado) => {
          const dataDado = parse(dado.dateIn, 'dd/MM/yyyy', new Date())
          return (
            dataDado.getMonth() === dataPesquisa.getMonth() &&
            dataDado.getFullYear() === dataPesquisa.getFullYear()
          )
        })
        .filter((item) =>
          valuesFields.expense !== ''
            ? item.expense
              .toUpperCase()
              .trim()
              .includes(valuesFields?.expense?.toUpperCase().trim())
            : item,
        )
        .filter((item) =>
          expense
            ? item.expense
              .toUpperCase()
              .trim()
              .includes(expense?.toUpperCase().trim())
            : item,
        )
        .filter((item) => (situation ? item.status === situation : item))
    } catch (err) {
      toast.error('Ocorreu um erro ao realizar a filtragem dos dados.')
    } finally {
      Loading.turnOff()
    }
  }

  const onHandleNewExpenses = () => {
    showMessage(NewExpenses, { setMakeRequest, history }, true)
  }

  const onUploadDocument = () => {
    showMessage(UploadDocument, { setMakeRequest }, false)
  }

  useEffect(() => {
    getDataOrderServices()
  }, [makeRequest])

  useEffect(() => {
    const result = dateFilter(
      `${monthSelected}/${yearSelected}`,
      incomes,
      '',
      expense,
    )
    setIncomesFiltered(result)
  }, [expense])

  useEffect(() => {
    return () => {
      window.localStorage.removeItem('selectedButtonExpense')
    }
  }, [])

  return (
    <>
      {!!incomes.length ? (
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
                justifyContent="space-between"
                alignItems="center"
              >
                <Row display="flex" flexDirection="row" gap={2}>
                  <Button
                    variant={
                      selectedButton === 'A PAGAR' ? 'contained' : 'outlined'
                    }
                    textButton="Pendentes"
                    color="warning"
                    onClick={() => onHandleSituation('A PAGAR')}
                  />
                  <Button
                    variant={
                      selectedButton === 'PAGO' ? 'contained' : 'outlined'
                    }
                    textButton="Pagos"
                    color="success"
                    onClick={() => onHandleSituation('PAGO')}
                  />
                </Row>
                {/* <Button
                  variant="outlined"
                  textButton="Incluir"
                  color="info"
                  icon="add"
                  onClick={onHandleNewExpenses}
                /> */}
              </Row>
            </Row>
            <Row display="flex" flexDirection="column" gap={1}>
              <Form onSubmit={handleSubmit(onSubmitIncome)} autoComplete="off">
                <Row display="grid" columns="1fr" alignItems="end" gap={10}>
                  <Controller
                    name="expense"
                    control={control}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                      <InputText
                        label="Despesa:"
                        field={field}
                        fieldState={fieldState}
                      />
                    )}
                  />
                </Row>
              </Form>
            </Row>
            <Row display='flex' justifyContent='flex-start' gap={5}>
              <Button
                variant="outlined"
                textButton="Incluir"
                color="primary"
                icon="add"
                onClick={onHandleNewExpenses}
                disabled={!hasPermission(DESPESAS_INCLUIR)}
              />
              <Button
                variant="outlined"
                textButton="Importar Extrato Nubank"
                color="secondary"
                icon="upload"
                onClick={onUploadDocument}
                disabled={!hasPermission(DESPESAS_INCLUIR)}
              />
            </Row>
          </Container>
        </Paper>

      ) : (
        <Row display='flex' justifyContent='flex-start' gap={5}>
          <Button
            variant="outlined"
            textButton="Incluir"
            color="primary"
            icon="add"
            onClick={onHandleNewExpenses}
            disabled={!hasPermission(DESPESAS_INCLUIR)}
          />
          <Button
            variant="outlined"
            textButton="Importar Extrato Nubank"
            color="secondary"
            icon="upload"
            onClick={onUploadDocument}
            disabled={!hasPermission(DESPESAS_INCLUIR)}
          />
        </Row>
      )}
    </>
  )
}

export default Filters
