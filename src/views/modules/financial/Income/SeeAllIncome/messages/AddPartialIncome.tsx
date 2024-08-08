/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { format } from 'date-fns'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from 'src/components'
import { Autocomplete, AutocompleteOptions } from 'src/components/Form/Autocomplete'
import InputMask from 'src/components/Form/InputMask'
import InputText from 'src/components/Form/InputText/index_old'
import { OptionsProps } from 'src/components/Form/Select'
import { Select } from 'src/components/Widgets/Select'
import { toast } from 'src/components/Widgets/Toastify'
import { exceptionHandle } from 'src/helpers/exceptions'
import { formatInputPrice, formatPrice } from 'src/helpers/formatPrice'
import { useModal } from 'src/hooks/useModal'
import { useAdmin } from 'src/services/useAdmin'
import { addDaysMaturity } from 'src/views/modules/financial/Expenses/SeeAllExpenses/messages/statics'
import {
  UpdateConfirmationContainer, UpdateDeleteConfirmationContainer
} from './style'

type AddPartialIncomeProps = {
  valueFormated: string
  clientName: string
  id: string
  situation: string
  description: string
  setMakeRequest: React.Dispatch<React.SetStateAction<number>>
}

type PartialData = {
  valuePartial: string
  paymentForm: string
  remainingValue: string
  remainingPaymentForm: string
  maturity: string
}

export const AddPartialIncome: React.FC<AddPartialIncomeProps> = ({
  clientName,
  id,
  valueFormated,
  description,
  setMakeRequest,
}) => {
  const { closeModal } = useModal()
  const { apiAdmin } = useAdmin()
  const [loading, setLoading] = useState(false)
  const [disableButton, setDisableButton] = useState(false)
  const [_, setClickedMaturity] = useState(
    {} as AutocompleteOptions,
  )
  const [optionMaturity, setOptionMaturity] = useState<AutocompleteOptions[]>(
    [] as AutocompleteOptions[],
  )
  const { control, handleSubmit, setValue, watch, setError } =
    useForm<PartialData>({
      shouldUnregister: false,
    })

  const remainingPaymentForm = watch('remainingPaymentForm')

  const cancel = () => {
    closeModal()
  }

  const onFormatterPrice = (value: string, field: any) => {
    const { formated, clean: valuePayment } = formatInputPrice(value)
    const { clean: total } = formatInputPrice(valueFormated)
    const valueFormatedRemaning = formatPrice(total - valuePayment)
    setValue(field, formated)
    setValue('remainingValue', valueFormatedRemaning)
    if (valuePayment > total) {
      setError('valuePartial', { message: 'O valor parcial pago não pode ser maior do que o total:' })
      setDisableButton(true)
    } else {
      setDisableButton(false)
      setError('valuePartial', { message: '' })
    }
  }

  const sformOfPaymentOptions: OptionsProps[] = [
    { label: 'Boleto', value: 'Boleto' },
    { label: 'Pix', value: 'Pix' },
    { label: 'Dinheiro', value: 'Dinheiro' },
    { label: 'Cheque', value: 'Cheque' },
    { label: 'Cartão de Crédito', value: 'Cartão de Crédito' },
    { label: 'Cartão de Débito', value: 'Cartão de Débito' },
  ]

  const onSubmit = async (data: PartialData) => {
    try {
      setLoading(true)
      if (!data.valuePartial) {
        setError('valuePartial', { message: 'Valor parcial obrigatório!' })
        return
      }
      if (data.remainingPaymentForm === 'Boleto' && !data.maturity) {
        setError('maturity', { message: 'Vencimento do boleto obrigatório!' })
        return
      }
      if (data.remainingPaymentForm !== 'Boleto') {
        setValue('maturity', '')
        data.maturity = ''
      }
      const dataOS = {
        ...data,
        id
      }
      await apiAdmin.put(`orderServices/partial/payment`, { ...dataOS })
      setMakeRequest && setMakeRequest(Math.random())
      closeModal()
      toast.success('Recebimento parcial adicionado com sucesso!')
    } catch (error) {
      exceptionHandle(error)
    } finally {
      setLoading(false)
    }
  }

  function getDateCurrent() {
    const dataAtual = new Date();
    const formato = 'dd/MM/yyyy';
    const diaAtual = format(dataAtual, formato);
    return diaAtual;
  }

  React.useEffect(() => {
    setValue('remainingPaymentForm', 'Boleto')
    setValue('paymentForm', 'Pix')
    setOptionMaturity(addDaysMaturity(getDateCurrent()))
  }, [])

  return (
    <UpdateConfirmationContainer>
      <div>
        Informe abaixo os dados do pagamento parcial:
      </div>
      <p></p>
      <div>Cliente: {clientName}</div>
      <div>Valor Total: {valueFormated}</div>
      <p></p>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Controller
          name="valuePartial"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <InputText
              label={'Valor Parcial Pago pelo Cliente:'}
              field={field}
              fieldState={fieldState}
              onKeyUp={() => onFormatterPrice(field.value, 'valuePartial')}
              hasError={!!fieldState.error}
              error={fieldState.error?.message}
            />
          )}
        />
        <p></p>
        <Controller
          name="paymentForm"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <Select
              label="Forma de Pagamento Realizado:"
              setValue={(value) => setValue('paymentForm', value)}
              value={field.value}
              options={!description ? sformOfPaymentOptions : sformOfPaymentOptions.filter((item) => item.value !== 'Boleto')}
            />
          )}
        />
        <p></p>
        <Controller
          name="remainingValue"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <InputMask
              label='Valor Restante:'
              variant="outlined"
              fieldState={fieldState}
              mask=""
              disabled
              setValue={(value) => setValue('remainingValue', value)}
              onKeyUp={() => onFormatterPrice(field.value, 'remainingValue')}
              {...field}
            />
          )}
        />
        <p></p>
        <Controller
          name="remainingPaymentForm"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <Select
              label="Forma de Pagamento do Valor Restante:"
              setValue={(value) => setValue('remainingPaymentForm', value)}
              value={field.value}
              options={!description ? sformOfPaymentOptions : sformOfPaymentOptions.filter((item) => item.value !== 'Boleto')}
            />
          )}
        />
        <p></p>
        {remainingPaymentForm === 'Boleto' &&
          <Controller
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
                hasError={!!fieldState.error}
                error={fieldState.error?.message}
                isUseButton
              />
            )}
          />}
        <p></p>

        <UpdateDeleteConfirmationContainer>
          <Button
            textButton="Confirmar"
            variant="outlined"
            size="large"
            icon="add2"
            type="submit"
            loading={loading}
            disabled={disableButton}
          />
          <Button
            textButton="Fechar"
            variant="outlined"
            size="large"
            icon="close"
            color="error"
            onClick={cancel}
          />
        </UpdateDeleteConfirmationContainer>
      </form>
    </UpdateConfirmationContainer>
  )
}
