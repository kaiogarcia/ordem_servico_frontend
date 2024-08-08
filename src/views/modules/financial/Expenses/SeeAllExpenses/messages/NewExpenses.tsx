/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from '@hookform/resolvers/yup'
import { Alert } from '@mui/material'
import axios from 'axios'
import moment from 'moment'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'src/components'
import {
  Autocomplete,
  AutocompleteOptions
} from 'src/components/Form/Autocomplete'
import { Checkbox } from 'src/components/Form/Checkbox'
import InputMask from 'src/components/Form/InputMask'
import InputText from 'src/components/Form/InputText/index_old'
import { Select } from 'src/components/Widgets/Select'
import { toast } from 'src/components/Widgets/Toastify'
import onlyNumbers from 'src/helpers/clear/onlyNumbers'
import { formatInputPrice } from 'src/helpers/formatPrice'
import { removeDuplicatesAutocomplete } from 'src/helpers/removeDuplicates'
import { useModal } from 'src/hooks/useModal'
import { useAdmin } from 'src/services/useAdmin'
import { Row } from 'src/styles'
import { SeeAllExpenseProps } from '../types'
import { fromApi } from './adapter/fromApi'
import { toApi } from './adapter/toApi'
import ConfirmationToSave from './ConfirmationToSave'
import { schemaExpense } from './schemaValidation'
import { addDaysMaturity, expensesTypeOptions, statusOptions } from './statics'
import {
  NewExpenseContainer,
  TitleModalNewExpense, UpdateDeleteConfirmationContainer
} from './style'

type UpdateConfirmationProps = {
  setMakeRequest: React.Dispatch<React.SetStateAction<number>>
  history: any
}

export const NewExpenses: React.FC<UpdateConfirmationProps> = ({
  setMakeRequest,
  history
}) => {
  const { closeModal, showMessage } = useModal()
  const { apiAdmin } = useAdmin()
  const [_, setValueClear] = useState(0)
  const [isToLaunchInPiece, setIsToLaunchInPiece] = useState(false)
  const [messageError, setMessageError] = useState(null)
  const [loading, setLoading] = React.useState(false)

  const { control, handleSubmit, setValue, watch, setError } =
    useForm<SeeAllExpenseProps>({
      resolver: yupResolver(schemaExpense),
      shouldUnregister: false,
    })

  const [optionMaturity, setOptionMaturity] = useState<AutocompleteOptions[]>(
    [] as AutocompleteOptions[],
  )

  const [optionExpense, setOptionExpense] = useState<AutocompleteOptions[]>(
    [] as AutocompleteOptions[],
  )

  const [clickedMaturity, setClickedMaturity] = useState(
    {} as AutocompleteOptions,
  )
  const [clickedExpense, setClickedExpense] = useState(
    {} as AutocompleteOptions,
  )

  const dateIn = watch('dateIn')
  const maturity = watch('maturity')
  const expense = watch('expense')
  const status = watch('status')
  const valueFormatedPiece = watch('valueFormatedPiece')

  const getDateCurrent = () => {
    const dataAtual = moment()
    const formato = 'DD/MM/YYYY'
    return dataAtual.format(formato)
  }

  const regiterPiece = async (expense: SeeAllExpenseProps) => {
    try {
      setLoading(true)
      const { clean: value } = formatInputPrice(expense.valueFormatedPiece)
      await apiAdmin.post(`pieces/register`, {
        description: expense.expense,
        value,
      })
      toast.success('Registrado em Peças e nas despesas com sucesso.')
      await saveExpense(expense)
    } catch ({ response }) {
      if (response?.status === 403) {
        setMessageError(response?.data?.message)
      } else {
        setMessageError('Opss! Ocorreu um erro ao tentar registrar em peças.')
      }
    } finally {
      setLoading(false)
    }
  }

  const saveExpense = async (data: SeeAllExpenseProps) => {
    try {
      setLoading(true)
      data = {
        ...data,
        maturity: clickedMaturity?.label || maturity,
        expense: clickedExpense?.label || data.expense,
        expense_type: data.expense_type
      }
      await apiAdmin.post(`expense`, toApi(data))
      setMakeRequest(Math.random())
      toast.success('Despesa financeira adicionada com sucesso.')
    } catch ({ response }) {
      if (response?.status === 403) {
        toast.error(response?.data?.message)
      } else {
        toast.error('Opss! Ocorreu um erro ao tentar registrar em peças.')
      }
    } finally {
      //closeModal()
      setLoading(false)
    }
  }

  const save = async (data: SeeAllExpenseProps) => {
    try {
      if (isToLaunchInPiece) {
        await regiterPiece(data)
      } else {
        await saveExpense(data)
      }
    } catch (error) { }
  }

  const cancel = () => {
    closeModal()
  }

  const onSubmitIncome = async (data: SeeAllExpenseProps) => {
    if (isToLaunchInPiece) {
      if (!valueFormatedPiece) {
        setError('valueFormatedPiece', { message: 'Valor p/ Revenda obrigatório.' })
        return
      }
    }
    // if (status === 'A PAGAR' && !data.maturity) {
    //   setError('maturity', { message: 'Vencimento obrigatório.' })
    //   return
    // }
    await save(data)
    showMessage(ConfirmationToSave, { history, setMakeRequest })
  }

  const onFormatterPrice = (value: string, field: any) => {
    const { formated, clean } = formatInputPrice(value)
    setValue(field, formated)
    setValueClear(clean)
  }

  React.useEffect(() => {
    if (dateIn) {
      const onlyNumber = onlyNumbers(dateIn)
      if (onlyNumber.length === 8) {
        setOptionMaturity(addDaysMaturity(dateIn))
      }
    }
  }, [dateIn])

  React.useEffect(() => {
    if (maturity) {
      setError('maturity', { message: '' })
      const onlyNumberMaturity = onlyNumbers(maturity)
      if (!onlyNumberMaturity.length) {
        if (dateIn) {
          const onlyNumberDateIn = onlyNumbers(dateIn)
          if (onlyNumberDateIn.length === 8) {
            setOptionMaturity(addDaysMaturity(dateIn))
          }
        } else {
          setOptionMaturity([])
        }
      }
    }
  }, [maturity])

  React.useEffect(() => {
    let cancel: any
    const getExpenses = async () => {
      try {
        const { data: dataExpense } = await apiAdmin.get('expense', {
          params: {
            expense: (expense && String(expense).toUpperCase()) || undefined,
          },

          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        })
        if (dataExpense) setOptionExpense(removeDuplicatesAutocomplete(fromApi(dataExpense)))
      } catch (error) {
        console.log(error)
        if (error?.response?.status === 403) {
          setMessageError(error?.response?.data?.message)
        } else {
          setMessageError(
            'Opss! Ocorreu um erro ao tentar buscar os registros de despesas.',
          )
        }
      }
    }
    getExpenses()
    setMessageError('')
    return () => cancel && cancel()
  }, [expense])

  React.useEffect(() => {
    setValue('status', 'PAGO')
    setValue('expense_type', 'Empresa')
  }, [])

  return (
    <NewExpenseContainer>
      <form onSubmit={handleSubmit(onSubmitIncome)} autoComplete="off">
        <Row display="flex" flexDirection="column" gap={1}>
          <Alert severity='warning'>Certifique-se de que ao adicionar esse despesa não tenha duplicidade com a importação do Nubank.</Alert>
          {!!messageError && <Alert severity="error">{messageError}</Alert>}
          <TitleModalNewExpense>Nova Despesa</TitleModalNewExpense>
          <Row
            display="grid"
            columns="1fr"
            alignItems="end"
            gap={10}
            marginBottom="20px"
          >
            <Controller
              name="expense"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <Autocomplete
                  label="Despesa:"
                  value={{ label: field.value, value: field.value }}
                  setValue={(previousState: AutocompleteOptions) =>
                    setValue('expense', previousState.label)
                  }
                  mask=""
                  options={optionExpense}
                  setOptions={setOptionExpense}
                  setClickedValue={(valueClicked) => {
                    setError('expense', { message: '' })
                    setClickedExpense(valueClicked)
                  }}
                  hasError={!!fieldState.error}
                  error={fieldState.error?.message}
                  isUseButton
                />
              )}
            />
          </Row>
          <Row>
            <Checkbox
              label="Registrar em Peças?"
              setValue={setIsToLaunchInPiece}
              checked={isToLaunchInPiece}
            />
          </Row>
          <Row
            display="grid"
            columns="repeat(3, 1fr)"
            alignItems="end"
            gap={10}
          >
            <Controller
              name="valueFormated"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <InputText
                  label={'Valor da Despesa'}
                  field={field}
                  fieldState={fieldState}
                  onKeyUp={() => onFormatterPrice(field.value, 'valueFormated')}
                />
              )}
            />
            <Controller
              name="valueFormatedPiece"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                // <InputText
                //   label={'Valor p/ Revenda'}
                //   field={field}
                //   fieldState={fieldState}
                //   disabled={!isToLaunchInPiece}
                //   onKeyUp={() => onFormatterPrice(field.value, 'valueFormatedPiece')}
                // />
                <InputMask
                  label='Valor p/ Revenda'
                  variant="outlined"
                  fieldState={fieldState}
                  hasError={!!fieldState.error}
                  msgError={fieldState.error?.message}
                  mask=""
                  disabled={!isToLaunchInPiece}
                  onKeyUp={() => onFormatterPrice(field.value, 'valueFormatedPiece')}
                  {...field}
                />
              )}
            />
            <Controller
              name="dateIn"
              control={control}
              defaultValue={getDateCurrent()}
              render={({ field, fieldState }) => (
                <InputMask
                  label="Entrada"
                  variant="outlined"
                  fieldState={fieldState}
                  hasError={!!fieldState.error}
                  msgError={fieldState.error?.message}
                  mask="99/99/9999"
                  {...field}
                />
              )}
            />
            {status === 'A PAGAR' && <Controller
              name="maturity"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <Autocomplete
                  label="Vencimento"
                  value={{ label: field.value, value: field.value }}
                  setValue={(previousState: AutocompleteOptions) =>
                    setValue('maturity', previousState.label)
                  }
                  mask="99/99/9999"
                  options={optionMaturity}
                  setOptions={setOptionMaturity}
                  setClickedValue={setClickedMaturity}
                  hasError={!!fieldState.error}
                  error={fieldState.error?.message}
                  isUseButton
                />
              )}
            />}
            <Controller
              name="status"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <Select
                  label={'Status'}
                  value={field.value}
                  setValue={(previousState) =>
                    setValue('status', previousState)
                  }
                  options={statusOptions}
                  hasError={!!fieldState.error}
                  msgError={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="expense_type"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <Select
                  label={'Tipo de Despesa'}
                  value={field.value}
                  setValue={(previousState) =>
                    setValue('expense_type', previousState)
                  }
                  options={expensesTypeOptions}
                  hasError={!!fieldState.error}
                  msgError={fieldState.error?.message}
                />
              )}
            />
          </Row>
        </Row>
        <UpdateDeleteConfirmationContainer>
          <Button
            textButton="Salvar"
            variant="outlined"
            size="large"
            icon="add2"
            type="submit"
            loading={loading}
          />
          <Button
            textButton="Cancelar"
            variant="outlined"
            size="large"
            icon="close"
            color="error"
            onClick={cancel}
          />
        </UpdateDeleteConfirmationContainer>
      </form>
    </NewExpenseContainer>
  )
}
