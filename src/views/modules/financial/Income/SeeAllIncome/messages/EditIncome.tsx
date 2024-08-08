/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from '@hookform/resolvers/yup'
import { Alert } from '@mui/material'
import FormControl from '@mui/material/FormControl/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel'
import FormLabel from '@mui/material/FormLabel/FormLabel'
import Radio from '@mui/material/Radio/Radio'
import RadioGroup from '@mui/material/RadioGroup/RadioGroup'
import moment from 'moment'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'src/components'
import {
  Autocomplete,
  AutocompleteOptions
} from 'src/components/Form/Autocomplete'
import InputMask from 'src/components/Form/InputMask'
import InputText from 'src/components/Form/InputText/index_old'
import { Select } from 'src/components/Widgets/Select'
import { toast } from 'src/components/Widgets/Toastify'
import { exceptionHandle } from 'src/helpers/exceptions'
import { formatInputPrice } from 'src/helpers/formatPrice'
import { useModal } from 'src/hooks/useModal'
import { useAdmin } from 'src/services/useAdmin'
import { Row } from 'src/styles'
import { OSData } from 'src/views/modules/manager/serviceOrder/create/type'
import { Income } from '../Table/adapter'
import { OptionsProps, SeeAllIncomeProps } from '../types'
import { toApi } from './adapter/toApi'
import { schemaIncome } from './schemaValidation'
import { statusOptions } from './statics'
import { NewIncomeContainer, TitleModalNewIncome, UpdateDeleteConfirmationContainer } from './style'

type UpdateConfirmationProps = {
  setMakeRequest: React.Dispatch<React.SetStateAction<number>>
  data: Income
}

export const EditIncome: React.FC<UpdateConfirmationProps> = ({
  setMakeRequest,
  data
}) => {
  const { closeModal, showMessage } = useModal()
  const { apiAdmin } = useAdmin()
  const [_, setValueClear] = useState(0)
  const [isDisableIncomeText, setIsDisableIncomeText] = useState(false)
  const [messageError, setMessageError] = useState(null)
  const [loading, setLoading] = React.useState(false)
  const [isLaunchMoney, setIsLaunchMoney] = React.useState(data?.isLaunchMoney ? 'yes' : 'no' || '')

  const { control, handleSubmit, setValue, watch, setError } =
    useForm<SeeAllIncomeProps>({
      resolver: yupResolver(schemaIncome),
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
  const [clickedIncome, setClickedIncome] = useState(
    {} as AutocompleteOptions,
  )

  const maturity = watch('maturity')
  const status = watch('status')
  const paymentForm = watch('paymentForm')

  const getDateCurrent = () => {
    const dataAtual = moment()
    const formato = 'DD/MM/YYYY'
    return dataAtual.format(formato)
  }

  const setLaunchMoney = (dataIncome: SeeAllIncomeProps) => {
    if (dataIncome.paymentForm === 'Dinheiro') {
      if (data?.situation === 'PAGO') {
        return undefined
      }
      if (isLaunchMoney === 'yes') {
        return true
      } else {
        return false
      }
    } else {
      return undefined
    }
  }

  const saveIncome = async (dataIncome: SeeAllIncomeProps) => {
    try {
      setLoading(true)
      dataIncome = {
        ...dataIncome,
        maturity: dataIncome.paymentForm === 'Boleto' ? (clickedMaturity?.label || maturity) : '',
        income: clickedIncome?.label || dataIncome.income,
        status: dataIncome?.status === 'PENDENTE' ? 'PENDENTE' : 'PAGO',
        isLaunchMoney: setLaunchMoney(dataIncome)
      }
      await apiAdmin.put(`orderServices/${data?.id}`, toApi(dataIncome))
      setTimeout(() => {
        setMakeRequest(Math.random())
        setLoading(false)
        toast.success('Receita financeira atualizada com sucesso.')
        closeModal()
      }, 2000)
    } catch (error) {
      exceptionHandle(error)
      setLoading(false)
      closeModal()
    }
  }

  const save = async (data: SeeAllIncomeProps) => {
    try {
      await saveIncome(data)
    } catch (error) {
      exceptionHandle(error)
    }
  }

  const cancel = () => {
    closeModal()
  }

  const onSubmitIncome = async (data: SeeAllIncomeProps) => {
    if (status === 'PENDENTE' && !data.maturity && data.paymentForm === 'Boleto') {
      setError('maturity', { message: 'Vencimento obrigatório.' })
      return
    }
    await save(data)
  }

  const onFormatterPrice = (value: string, field: any) => {
    const { formated, clean } = formatInputPrice(value)
    setValue(field, formated)
    setValueClear(clean)
  }

  const getIncomeById = async () => {
    try {
      const { data: result } = await apiAdmin.get<OSData>(`orderServices/${data?.id}`)
      const incomeData = result?.description ? result?.description : result?.client?.name
      setIsDisableIncomeText(!result?.description)
      setValue('income', incomeData)
      setValue('valueFormated', result?.total)
      setValue('dateIn', result?.dateOS)
      setValue('status', result?.status === 'PAGO' ? 'RECEBIDO' : 'PENDENTE')
      setValue("paymentForm", result?.formOfPayment)
      setValue('maturity', result?.maturityOfTheBoleto)
      setValue('dateClientPayment', result?.dateClientPayment)
    } catch (error) {
      exceptionHandle(error)
    }
  }

  React.useEffect(() => {
    console.log(data)
    getIncomeById()
  }, [])

  const sformOfPaymentOptions: OptionsProps[] = [
    { label: 'Boleto', value: 'Boleto' },
    { label: 'Pix', value: 'Pix' },
    { label: 'Dinheiro', value: 'Dinheiro' },
    { label: 'Cheque', value: 'Cheque' },
    { label: 'Cartão de Crédito', value: 'Cartão de Crédito' },
    { label: 'Cartão de Débito', value: 'Cartão de Débito' },
  ]

  const onHandleChangeMoney = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueClicked = (event.target as HTMLInputElement).value
    setIsLaunchMoney(valueClicked)
  };

  return (
    <NewIncomeContainer>
      <form onSubmit={handleSubmit(onSubmitIncome)} autoComplete="off">
        <Row display="flex" flexDirection="column" gap={1}>
          {!!messageError && <Alert severity="error">{messageError}</Alert>}
          {!!isDisableIncomeText && <Alert severity="info">{`O nome do cliente e valor não pode ser editado, pois existe o documento de nº ${data?.osNumber} vinculado ao mesmo.`}</Alert>}
          {/* {(data?.situation === 'PAGO' && data?.formOfPayment === 'Dinheiro') && <Alert severity="warning">{'Atenção ao marcar a opção '}</Alert>} */}
          <TitleModalNewIncome>Edição de Receita</TitleModalNewIncome>
          <Row
            display="grid"
            columns="1fr"
            alignItems="end"
            gap={10}
            marginBottom="20px"
          >
            <Controller
              name="income"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <Autocomplete
                  label="Receita:"
                  disabled={isDisableIncomeText}
                  value={{ label: field.value, value: field.value }}
                  setValue={(previousState: AutocompleteOptions) =>
                    setValue('income', previousState.label)
                  }
                  mask=""
                  options={optionExpense}
                  setOptions={setOptionExpense}
                  setClickedValue={(valueClicked) => {
                    setError('income', { message: '' })
                    setClickedIncome(valueClicked)
                  }}
                  hasError={!!fieldState.error?.message}
                  error={fieldState.error?.message}
                  isUseButton
                />
              )}
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
                  label={'Valor da Receita'}
                  field={field}
                  disabled={isDisableIncomeText}
                  fieldState={fieldState}
                  onKeyUp={() => onFormatterPrice(field.value, 'valueFormated')}
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
                  hasError={!!fieldState.error?.message}
                  msgError={fieldState.error?.message}
                  mask="99/99/9999"
                  disabled
                  {...field}
                />
              )}
            />
            {(status === 'PENDENTE' && paymentForm === 'Boleto') && <Controller
              name="maturity"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <Autocomplete
                  label="Vencimento"
                  value={{ label: field.value, value: field.value }}
                  setValue={(previousState: AutocompleteOptions) => {
                    setValue('maturity', previousState.label)
                    setError('maturity', { message: '' })
                  }
                  }
                  mask="99/99/9999"
                  options={optionMaturity}
                  setOptions={setOptionMaturity}
                  setClickedValue={setClickedMaturity}
                  hasError={!!fieldState.error?.message}
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
                  hasError={!!fieldState.error?.message}
                  msgError={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="paymentForm"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <Select
                  label="Forma de Pagamento:"
                  setValue={(value) => setValue('paymentForm', value)}
                  value={field.value}
                  options={!data?.description ? sformOfPaymentOptions : sformOfPaymentOptions.filter((item) => item.value !== 'Boleto')}
                />
              )}
            />
            {(paymentForm === 'Dinheiro' && status !== 'PENDENTE') &&
              <FormControl disabled={data?.situation === 'PAGO'}>
                <FormLabel>O dinheiro recebido foi depositado na conta?</FormLabel>
                <RadioGroup
                  row
                  value={isLaunchMoney}
                  onChange={onHandleChangeMoney}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Sim" />
                  <FormControlLabel value="no" control={<Radio />} label="Não" />
                </RadioGroup>
              </FormControl>}

            {status === 'RECEBIDO' && <Controller
              name="dateClientPayment"
              control={control}
              defaultValue={getDateCurrent()}
              render={({ field, fieldState }) => (
                <InputMask
                  label="Data do Recebimento"
                  variant="outlined"
                  fieldState={fieldState}
                  hasError={!!fieldState.error?.message}
                  msgError={fieldState.error?.message}
                  mask="99/99/9999"
                  {...field}
                />
              )}

            />}
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
            disabled={paymentForm === 'Dinheiro' && !isLaunchMoney}
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
    </NewIncomeContainer>
  )
}
