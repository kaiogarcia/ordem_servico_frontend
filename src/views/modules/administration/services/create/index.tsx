/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { InputText } from 'src/components'
import Button from 'src/components/Form/Button'
import { toast } from 'src/components/Widgets/Toastify'
import { exceptionHandle } from 'src/helpers/exceptions'
import { formatInputPrice } from 'src/helpers/formatPrice'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { ADMINISTRATION_SERVICES } from 'src/layouts/typePath'
import { useAdmin } from 'src/services/useAdmin'
import {
  LAYOUT_IS_MODIFIED_FIELDS,
  LAYOUT_MAKE_REQUEST,
  SERVICE_FILTER,
  SERVICE_SEE_ALL,
} from 'src/store/actions'
import { ServiceT } from 'src/store/Types'
import { Row } from 'src/styles'
import { fromApi } from '../adapters'
import { schemaService } from '../schemaValidation'
import { toApi } from './adapters'
import { ButtonContainer, Container, Form } from './style'
import TableView from './Table'
import { Alert } from '@mui/material'
import ConfirmationToSave from '../messages/ConfirmationToSave'

type CreateServiceProps = {
  isNewServiceByOS?: boolean
}

const CreateService: React.FC<CreateServiceProps> = ({
  isNewServiceByOS = false,
}) => {
  const dispatch = useDispatch()
  const { closeModal, showMessage } = useModal()
  const { apiAdmin } = useAdmin()
  const [loading, setLoading] = useState(false)
  const { Loading } = useLoading()
  const [errorMessage, setErrorMessage] = useState('')

  const { control, handleSubmit, setValue, getValues, setError, watch } =
    useForm<ServiceT>({
      shouldUnregister: false,
      resolver: yupResolver(schemaService),
    })

  const [valueClear, setValueClear] = useState(0)
  const [laudos, setLaudos] = useState<string[]>([])
  const history = useHistory()
  const description = watch('description')
  const laudo = watch('laudos')
  const laudoService = watch('laudoService')
  const value = watch('value')

  const clearAllFields = () => {
    setValue('description', '')
    setValue('laudoService', '')
    setValue('laudos', [])
    setValue('value', '')
    setLaudos([])
    dispatch({
      type: LAYOUT_IS_MODIFIED_FIELDS,
      payload: {
        fields: {},
        url: ''
      },
    })
  }

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

  const onSubmit = async (data: ServiceT) => {
    setError("laudoService", { message: '' })
    if (!laudos.length) {
      setError('laudoService', { message: 'Laudo do serviço obrigatório.' })
      return
    }
    if (data.laudoService) {
      setError('laudoService', { message: 'Laudo do serviço não adicionado, você precisa adicionar o laudo antes de salvar.' })
      return
    }
    try {
      Loading.turnOn()
      setLoading(true)
      await apiAdmin.post(`services`, toApi(data, valueClear, laudos))
      dispatch({
        type: SERVICE_FILTER,
        payload: {},
      })
      toast.success('Serviço cadastrado com sucesso.')
      if (isNewServiceByOS) {
        await getServices()
        closeModal()
        dispatch({
          type: LAYOUT_MAKE_REQUEST,
          payload: {
            makeRequest: Math.random(),
          },
        })
      } else {
        showMessage(ConfirmationToSave, { history, clearAllFields })
      }
    } catch (error) {
      exceptionHandle(error)
      if (isNewServiceByOS) {
        setErrorMessage(error?.response?.data.message)
      }
    } finally {
      Loading.turnOff()
      setLoading(false)
      clearAllFields()
    }
  }

  const onFormatterPrice = (value: string) => {
    const { formated, clean } = formatInputPrice(value)
    setValue('value', formated)
    setValueClear(clean)
  }

  const addLaudo = () => {
    const { laudoService } = getValues()
    if (!!laudoService) {
      setLaudos([...laudos, laudoService])
      setValue('laudoService', '')
      setError("laudoService", { message: null })
    } else {
      setError('laudoService', {
        message: 'Necessário informar o laudo do serviço.',
      })
    }
  }

  const onHandleClose = () => {
    clearAllFields()
    if (isNewServiceByOS) {
      closeModal()
    } else {
      history.push(ADMINISTRATION_SERVICES)
    }
  }

  React.useEffect(() => {
    scroll(0, 0)
  }, [])

  React.useEffect(() => {
    if (description) {
      setErrorMessage('')
    }
  }, [description])

  React.useEffect(() => {
    setErrorMessage('')
    dispatch({
      type: LAYOUT_IS_MODIFIED_FIELDS,
      payload: {
        fields: {
          description: description,
          value,
          laudoService,
        },
        url: window.location.pathname
      },
    })
  }, [description, value, laudoService])

  return (
    <Container>
      {!!errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        {!!isNewServiceByOS && <div>Novo serviço</div>}
        <Row columns="3fr 1fr">
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputText label={'Nome'} field={field} fieldState={fieldState} />
            )}
          />
          <Controller
            name="value"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputText
                label={'Valor'}
                field={field}
                fieldState={fieldState}
                onKeyUp={() => onFormatterPrice(field.value)}
              />
            )}
          />
        </Row>
        <Row columns="3fr 1fr" marginTop="10px" alignItems='flex-end'>
          <Controller
            name="laudoService"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <>
                <InputText
                  label={'Laudo do serviço'}
                  field={field}
                  fieldState={fieldState}
                  toUpperCase={false}
                  capitalizeWords
                />
              </>
            )}
          />
          <Button
            textButton="Adicionar Laudo"
            variant="outlined"
            size="large"
            icon="add2"
            onClick={addLaudo}
          />
        </Row>
        <Row columns="1fr" marginTop="10px">
          <TableView laudos={laudos} setLaudos={setLaudos} />
        </Row>
        <ButtonContainer>
          <Button
            textButton="Salvar"
            variant="contained"
            size="large"
            icon="add"
            type="submit"
            loading={loading}
          />
          <Button
            textButton="Voltar"
            variant="outlined"
            size="large"
            icon="back"
            onClick={onHandleClose}
          />
        </ButtonContainer>
      </Form>
    </Container>
  )
}

export default CreateService
