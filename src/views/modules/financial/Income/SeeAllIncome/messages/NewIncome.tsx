/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from '@hookform/resolvers/yup'
import { Alert, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
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
import { exceptionHandle } from 'src/helpers/exceptions'
import { formatInputPrice } from 'src/helpers/formatPrice'
import { useModal } from 'src/hooks/useModal'
import { useAdmin } from 'src/services/useAdmin'
import { Row } from 'src/styles'
import { OptionsProps, SeeAllIncomeProps } from '../types'
import { toApi } from './adapter/toApi'
import { schemaIncome } from './schemaValidation'
import { statusOptions } from './statics'
import { NewIncomeContainer, TitleModalNewIncome, UpdateDeleteConfirmationContainer } from './style'

type UpdateConfirmationProps = {
  setMakeRequest: React.Dispatch<React.SetStateAction<number>>
  history: any
}

export const NewIncome: React.FC<UpdateConfirmationProps> = ({
  setMakeRequest,
  history
}) => {
  const { closeModal } = useModal()
  const { apiAdmin } = useAdmin()
  const [_, setValueClear] = useState(0)
  const [isNote, setIsNote] = useState(false)
  const [messageError, setMessageError] = useState(null)
  const [loading, setLoading] = React.useState(false)

  const { control, handleSubmit, setValue, watch, setError } =
    useForm<SeeAllIncomeProps>({
      resolver: yupResolver(schemaIncome),
      shouldUnregister: false,
    })

  const [isLaunchMoney, setIsLaunchMoney] = React.useState('')

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
      if (isLaunchMoney === 'yes') {
        return true
      } else {
        return false
      }
    } else {
      return undefined
    }
  }

  const saveIncome = async (data: SeeAllIncomeProps) => {
    try {
      setLoading(true)
      data = {
        ...data,
        maturity: data.paymentForm === 'Boleto' ? (clickedMaturity?.label || maturity) : '',
        income: clickedIncome?.label || data.income,
        status: data?.status === 'PENDENTE' ? 'PENDENTE' : 'PAGO',
        isLaunchMoney: setLaunchMoney(data)
      }
      await apiAdmin.post(`orderServices`, toApi(data))
      setTimeout(() => {
        setMakeRequest(Math.random())
        setLoading(false)
        toast.success('Receita financeira adicionada com sucesso.')
        closeModal()
      }, 2000)
    } catch (error) {
      exceptionHandle(error)
      closeModal()
      setLoading(false)
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
    // if (isNote) {
    //   if (!valueFormatedPiece) {
    //     setError('valueFormatedPiece', { message: 'Valor p/ Revenda obrigatório.' })
    //     return
    //   }
    // }
    if (status === 'PENDENTE' && !data.maturity && data.paymentForm === 'Boleto') {
      setError('maturity', { message: 'Vencimento obrigatório.' })
      return
    }
    await save(data)
    // showMessage(ConfirmationToSave, { history, setMakeRequest })
  }

  const onFormatterPrice = (value: string, field: any) => {
    const { formated, clean } = formatInputPrice(value)
    setValue(field, formated)
    setValueClear(clean)
  }

  // useEffect(() => {
  //   if (isNote && clickedClient?.label) {
  //     if (status === 'PAGO') {
  //       setValue('income', `DINHEIRO RECEBIDO DE ${clickedClient?.label}`)
  //     } else if (status === 'A PAGAR') {
  //       setValue('income', `DINHEIRO A RECEBER DE ${clickedClient?.label}`)
  //     }
  //   } else {
  //     setValue('income', '')
  //   }
  // }, [isNote, clickedClient?.label, status])

  useEffect(() => {
    if (isNote) {
      setValue('income', `NOTINHA`)
    } else {
      setValue('income', '')
    }
  }, [isNote])

  // useEffect(() => {
  //   let cancel: any

  //   const loadClient = async () => {
  //     try {
  //       const { data } = await apiAdmin.get(`clients`, {
  //         params: {
  //           name: client,
  //         },

  //         cancelToken: new axios.CancelToken((c) => (cancel = c)),
  //       })

  //       const dataMapped = data?.map((val: ClientT) => ({
  //         value: val._id,
  //         label: val.name,
  //       }))

  //       setOptionClients(dataMapped)
  //     } catch (error) {
  //       if (axios.isCancel(error)) {
  //         console.log('Request canceled', error.message)
  //       }
  //     }
  //   }
  //   loadClient()
  //   return () => cancel && cancel()
  // }, [client])

  React.useEffect(() => {
    setValue('status', 'RECEBIDO')
    setValue('paymentForm', 'Pix')
  }, [])

  const sformOfPaymentOptions: OptionsProps[] = [
    //{ label: 'Boleto', value: 'Boleto' },
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
          {/* <Alert severity='warning'>Certifique-se de que ao adicionar esse receita não tenha duplicidade com a importação do Nubank.</Alert> */}
          <Alert severity="warning"><b>Essa opção de inclusão de receita não tem vínculo com nenhuma ordem serviço, consequentemente não terá opções de importação de boleto e não irá aparecer na tela de gestão de OS.</b></Alert>
          {!!messageError && <Alert severity="error">{messageError}</Alert>}
          <TitleModalNewIncome>Inclusão de Receita</TitleModalNewIncome>
          <Row>
            <Checkbox
              label="Notinha"
              setValue={setIsNote}
              checked={isNote}
            />
          </Row>
          {/* <Alert severity="info"><b>Ao selecionar a opção a cima o sistema irá cadastrar uma despesa com o mesmo valor para não prejudicar o lucro da empresa.</b></Alert> */}
          <p />
          {/* {isNote && <Row display="grid"
            columns="1fr"
            alignItems="end"
            gap={10}
            marginBottom="20px">
            <Controller
              name="client"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <Autocomplete
                  label="Cliente:"
                  value={{ label: field.value, value: field.value }}
                  setValue={(previousState: AutocompleteOptions) =>
                    setValue('client', previousState.label)
                  }
                  mask=""
                  placeholder='Selecione o cliente...'
                  options={optionClients}
                  setOptions={setOptionClients}
                  setClickedValue={(valueClicked) => {
                    setError('client', { message: '' })
                    setClickedClient(valueClicked)
                  }}
                  hasError={!!fieldState.error?.message}
                  error={fieldState.error?.message}
                  isUseButton
                />
              )}
            />
          </Row>} */}
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
                  disabled={isNote}
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
                  options={sformOfPaymentOptions}
                />
              )}
            />
            {(paymentForm === 'Dinheiro' && status !== 'PENDENTE') &&
              <FormControl>
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
    </NewIncomeContainer>
  )
}
