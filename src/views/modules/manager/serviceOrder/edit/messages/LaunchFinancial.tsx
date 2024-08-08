import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import InputText from '../components/InputCurrency'
import { toast } from 'src/components/Widgets/Toastify'
import { useAdmin } from 'src/services/useAdmin'
import { SERVICE_FILTER } from 'src/store/actions'
import { OSData } from '../type'
import { ButtonContainer, Modal } from './style'
import { Select } from 'src/components/Widgets/Select'
import { OptionsProps } from 'src/components/Form/Select'
import { Button } from 'src/components'
import { useModal } from 'src/hooks/useModal'
import { LaunchFinancialConfirmation } from './LaunchFinancialConfirmation'
import InputMask from 'src/components/Form/InputMask'
import { validateDate } from 'src/helpers/validateDateTime'
import { Alert } from '@mui/material'
import clearSpecialCharacters from 'src/helpers/clearSpecialCharacters'
import { Autocomplete, AutocompleteOptions } from 'src/components/Form/Autocomplete'
import { format } from 'date-fns'
import onlyNumbers from 'src/helpers/clear/onlyNumbers'
import { addDaysMaturity } from 'src/views/modules/financial/Expenses/SeeAllExpenses/messages/statics'

type LauchFinancialProps = {
  data: OSData
  history: any
  resetAllField: () => void
}

export const LaunchFinancial: React.FC<LauchFinancialProps> = ({
  data,
  history,
  resetAllField,
}) => {
  const { apiAdmin } = useAdmin()
  const dispatch = useDispatch()
  const { closeModal, showMessage } = useModal()
  const [loading, setLoading] = useState(false)
  // const [maturityOfTheBoleto, setMaturityOfTheBoleto] = useState('')
  const [maturityOfTheBoleto, setMaturityOfTheBoleto] = useState<AutocompleteOptions>({} as AutocompleteOptions)
  const [validateDateMaturityErrorMessage, setValidateDateMaturityErrorMessage] = useState('')
  const [status, setStatus] = useState('PENDENTE')
  const [clickedMaturity, setClickedMaturity] = useState(
    {} as AutocompleteOptions,
  )
  const [optionMaturity, setOptionMaturity] = useState<AutocompleteOptions[]>(
    [] as AutocompleteOptions[],
  )
  const statusOptions: OptionsProps[] = [
    { label: 'Pendente', value: 'PENDENTE' },
    { label: 'Pago', value: 'PAGO' },
  ]

  const [formOfPayment, setFormOfPayment] = useState('Boleto')
  const sformOfPaymentOptions: OptionsProps[] = [
    { label: 'Boleto', value: 'Boleto' },
    { label: 'Pix', value: 'Pix' },
    { label: 'Dinheiro', value: 'Dinheiro' },
    { label: 'Cheque', value: 'Cheque' },
    { label: 'Cartão de Crédito', value: 'Cartão de Crédito' },
    { label: 'Cartão de Débito', value: 'Cartão de Débito' },
  ]

  const saveOS = async () => {
    setValidateDateMaturityErrorMessage('')
    if (formOfPayment === 'Boleto' && clearSpecialCharacters(maturityOfTheBoleto.label).trim() === '') {
      setValidateDateMaturityErrorMessage('Data de vencimento do boleto obrigatório.')
      return
    }

    if (formOfPayment === 'Boleto') {
      const validateDateMaturity = validateDate(maturityOfTheBoleto.label)
      if (validateDateMaturity) {
        setValidateDateMaturityErrorMessage(validateDateMaturity)
        return
      }
    }


    const dataOS = {
      ...data,
      status,
      formOfPayment,
      maturityOfTheBoleto: maturityOfTheBoleto?.label || clickedMaturity?.label
    }

    try {
      setLoading(true)
      await apiAdmin.put(`orderServices/${data?._id}`, dataOS)
      dispatch({
        type: SERVICE_FILTER,
        payload: {},
      })
      toast.success('Ordem de serviço cadastrada com sucesso.')
      showMessage(LaunchFinancialConfirmation, { history, resetAllField })
    } catch (error) {
      toast.error('Houve um erro ao tentar salvar a Ordem de Serviço.')
    } finally {
      setLoading(false)
      setValidateDateMaturityErrorMessage('')
    }
  }

  function getDateCurrent() {
    const dataAtual = new Date();
    const formato = 'dd/MM/yyyy';
    const diaAtual = format(dataAtual, formato);
    return diaAtual;
  }

  useEffect(() => {
    setValidateDateMaturityErrorMessage('')
  }, [maturityOfTheBoleto])

  useEffect(() => {
    const onlyNumber = onlyNumbers(getDateCurrent())
    if (onlyNumber.length === 8) {
      setOptionMaturity(addDaysMaturity(getDateCurrent()))
    }
  }, [])

  return (
    <Modal isHasMaturity={formOfPayment === 'Boleto'}>
      {!!validateDateMaturityErrorMessage && <Alert severity='error'>{validateDateMaturityErrorMessage}</Alert>}
      <div>Lançamento Financeiro</div>
      <InputText type="text" label="Data" value={data.dateOS} disabled />
      <InputText
        type="text"
        label="Cliente"
        value={data.client.name}
        disabled
      />
      {/* <InputText
        type="text"
        label="CPF/CNPJ"
        value={data.client.cpfOrCnpj}
        disabled
      /> */}
      <Select
        label="Situação"
        setValue={setStatus}
        value={status}
        options={statusOptions}
      />
      <section>
        <Select
          label="Forma de pagamento"
          setValue={setFormOfPayment}
          value={formOfPayment}
          options={sformOfPaymentOptions}
        />
        {/* {formOfPayment === 'Boleto' && <InputMask type="text" label="Vencimento" value={maturityOfTheBoleto} setValue={setMaturityOfTheBoleto} mask='99/99/9999' />} */}
        {formOfPayment === 'Boleto' && <Autocomplete
          label="Vencimento"
          value={maturityOfTheBoleto}
          setValue={(previousState: AutocompleteOptions) =>
            setMaturityOfTheBoleto(previousState)
          }
          mask="99/99/9999"
          options={optionMaturity}
          setOptions={setOptionMaturity}
          setClickedValue={setClickedMaturity}
          isUseButton
        />}
        <InputText type="text" label="Valor" value={data.total} disabled />
      </section>
      <ButtonContainer>
        <Button
          textButton="Lançar Financeiro"
          variant="outlined"
          size="large"
          icon="add2"
          onClick={saveOS}
          loading={loading}
        />
        <Button
          textButton="Fechar"
          variant="outlined"
          size="large"
          icon="close"
          color="error"
          onClick={closeModal}
        />
      </ButtonContainer>
    </Modal>
  )
}
