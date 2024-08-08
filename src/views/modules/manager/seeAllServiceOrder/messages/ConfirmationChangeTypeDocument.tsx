import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Button from 'src/components/Form/Button'
import { toast } from 'src/components/Widgets/Toastify'
import { exceptionHandle } from 'src/helpers/exceptions'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { useAdmin } from 'src/services/useAdmin'
import { LAYOUT_MAKE_REQUEST } from 'src/store/actions'
import { MappedDataServiceOrders } from '../types'
import { ButtonGroup, Container, Text } from './style'
import { OptionsProps } from 'src/components/Form/Select'
import { Select } from 'src/components/Widgets/Select'
import { Autocomplete, AutocompleteOptions } from 'src/components/Form/Autocomplete'
import onlyNumbers from 'src/helpers/clear/onlyNumbers'
import { addDays, format, isValid } from 'date-fns'

const ConfirmationChangeTypeDocument: React.FC<MappedDataServiceOrders> = ({
  id,
  osNumber,
  name,
  typeDocument,
  total,
  clientId,
  idFileCreatedGoogleDrive
}) => {
  const { closeModal } = useModal()
  const { Loading } = useLoading()
  const { apiAdmin } = useAdmin()
  const dispatch = useDispatch()
  const [status, setStatus] = useState('PENDENTE')
  const [formOfPayment, setFormOfPayment] = useState('Pix')
  const [errorMaturity, setErrorMaturity] = useState('')
  const [maturity, setMaturity] = useState<AutocompleteOptions>({} as AutocompleteOptions)
  const [optionMaturity, setOptionMaturity] = useState<AutocompleteOptions[]>(
    [] as AutocompleteOptions[],
  )
  const [clickedMaturity, setClickedMaturity] = useState(
    {} as AutocompleteOptions,
  )
  const [loading, setLoading] = useState(false)

  const sformOfPaymentOptions: OptionsProps[] = [
    { label: 'Pix', value: 'Pix' },
    { label: 'Boleto', value: 'Boleto' },
    { label: 'Dinheiro', value: 'Dinheiro' },
    { label: 'Cheque', value: 'Cheque' },
    { label: 'Cartão de Crédito', value: 'Cartão de Crédito' },
    { label: 'Cartão de Débito', value: 'Cartão de Débito' },
  ]

  const updateTypeDocument = async () => {
    if (formOfPayment === 'Boleto' && !maturity?.label) {
      setErrorMaturity('Vencimento do boleto obrigatório')
      return
    }
    try {
      setLoading(true)
      Loading.turnOn()
      await apiAdmin.put(`orderServices/${id}`, {
        typeDocument: getInverseTypeDocumentToApi(typeDocument),
        status,
        formOfPayment: formOfPayment || undefined,
        maturityOfTheBoleto: maturity?.label || clickedMaturity?.label || undefined
      })
      await apiAdmin.get(`orderServices/move-file-by-status`, {
        params: {
          id,
          idFileCreatedGoogleDrive,
          clientId,
          typeDocument: getInverseTypeDocumentToApi(typeDocument),
          status,
        }
      })
      toast.success(`${getTypeDocument(typeDocument)} de nº ${osNumber} convertida para ${getInverseTypeDocument(typeDocument)} com sucesso!`)
      closeModal()
      dispatch({
        type: LAYOUT_MAKE_REQUEST,
        payload: {
          makeRequest: Math.random(),
        },
      })
    } catch (error) {
      exceptionHandle(
        error,
        `Ops, Houve um erro ao tentar converter o tipo de documento, atualize a página e tente novamente.`,
      )
    } finally {
      Loading.turnOff()
      setLoading(false)
    }
  }

  const getTypeDocument = (typeDocument: string) => {
    if (typeDocument === 'ORDEM_DE_SERVICO') return 'Ordem de Serviço'
    if (typeDocument === 'ORCAMENTO') return 'Orçamento'
  }
  const getInverseTypeDocument = (typeDocument: string) => {
    if (typeDocument === 'ORDEM_DE_SERVICO') return 'Orçamento'
    if (typeDocument === 'ORCAMENTO') return 'Ordem de Serviço'
  }
  const getInverseTypeDocumentToApi = (typeDocument: string) => {
    if (typeDocument === 'ORDEM_DE_SERVICO') return 'ORCAMENTO'
    if (typeDocument === 'ORCAMENTO') return 'ORDEM_DE_SERVICO'
  }

  const addDaysMaturity = (): AutocompleteOptions[] => {
    const date = new Date()
    if (!isValid(date)) {
      return [] as AutocompleteOptions[]
    }
    const datePlus15Days = addDays(date, 15)
    const datePlus30Days = addDays(date, 30)
    const result = [
      format(datePlus15Days, 'dd/MM/yyyy'),
      format(datePlus30Days, 'dd/MM/yyyy'),
    ]
    return [
      { label: result[0], value: result[0] },
      { label: result[1], value: result[1] },
    ]
  }

  React.useEffect(() => {
    setOptionMaturity(addDaysMaturity())
  }, [])

  return (
    <Container>
      <Text alignSelf="center" fontSize="20px">
        Deseja converter para <b style={{ marginLeft: '5px' }}>{getInverseTypeDocument(typeDocument)}</b> ?
      </Text>
      <Text flexDirection="column">
        <div>
          {getTypeDocument(typeDocument)}: <span>{osNumber}</span>
        </div>
        <div>
          Cliente: <span>{name}</span>
        </div>
        <div>
          Total: <span>{total}</span>
        </div>
      </Text>
      {typeDocument === 'ORCAMENTO' && <>
        <Text>
          Selecione abaixo qual status financeiro deseja atualizar o registro:
        </Text>
        <Select setValue={setStatus} value={status} options={[
          { label: 'PENDENTE', value: 'PENDENTE' },
          { label: 'PAGO', value: 'PAGO' },
        ]} />
        <Select
          label="Forma de pagamento"
          setValue={setFormOfPayment}
          value={formOfPayment}
          options={sformOfPaymentOptions}
        />
        {formOfPayment === 'Boleto' && <Autocomplete
          label="Vencimento"
          value={maturity}
          setValue={(previousState: AutocompleteOptions) => {
            setMaturity(previousState)
            setErrorMaturity('')
          }
          }
          mask="99/99/9999"
          options={optionMaturity}
          setOptions={setOptionMaturity}
          setClickedValue={setClickedMaturity}
          hasError={!!errorMaturity}
          error={errorMaturity}
          isUseButton
        />}
      </>}
      <ButtonGroup>
        <Button
          textButton="Sim"
          variant="contained"
          color="primary"
          icon="update"
          onClick={() => updateTypeDocument()}
          loading={loading}
        />
        <Button
          textButton="Não"
          variant="outlined"
          icon="back"
          onClick={() => closeModal()}
        />
      </ButtonGroup>
    </Container>
  )
}

export default ConfirmationChangeTypeDocument
