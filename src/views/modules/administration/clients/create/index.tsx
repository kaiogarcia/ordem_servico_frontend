/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { yupResolver } from '@hookform/resolvers/yup'
import { Alert, Checkbox, FormControlLabel, FormGroup, FormHelperText } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { InputText } from 'src/components'
import Button from 'src/components/Form/Button'
import InputCPF_CNPJ from 'src/components/Form/InputCPF_CNPJ'
import InputMask from 'src/components/Form/InputMask'
import InputPhone from 'src/components/Form/InputPhone'
import { toast } from 'src/components/Widgets/Toastify'
import clearSpecialCharacters from 'src/helpers/clearSpecialCharacters'
import { exceptionHandle } from 'src/helpers/exceptions'
import { validateCNPJ } from 'src/helpers/validateCNPJ'
import validateCpf from 'src/helpers/validateCpf'
import { validateTwoPhoneTypes } from 'src/helpers/validateFields/validateTwoPhoneTypes'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { ADMINISTRATION_CLIENTS } from 'src/layouts/typePath'
import { useServiceCEP } from 'src/services/ServiceCEP'
import { useAdmin } from 'src/services/useAdmin'
import {
  CLIENT_FILTER,
  LAYOUT_IS_MODIFIED_FIELDS,
  LAYOUT_MAKE_REQUEST,
} from 'src/store/actions'
import { ClientT } from 'src/store/Types'
import { Row } from 'src/styles'
import ConfirmationToSave from '../messages/ConfirmationToSave'
import { schemaClient } from '../schemaValidation'
import { ButtonContainer, Container, Form } from './style'

type CreateClientProps = {
  isNewServiceByOS?: boolean
}

const CreateClient: React.FC<CreateClientProps> = ({ isNewServiceByOS }) => {
  const dispatch = useDispatch()
  const { closeModal, showMessage } = useModal()
  const { apiAdmin } = useAdmin()
  const { getAddressByCEP } = useServiceCEP()
  const { Loading } = useLoading()
  const [errorMessage, setErrorMessage] = useState('')
  const [isSendFilesWhatsappNotification, setIsSendFilesWhatsappNotification] = useState(false)
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit, setValue, setError, watch } = useForm<ClientT>(
    {
      shouldUnregister: false,
      resolver: yupResolver(schemaClient),
    },
  )

  const history = useHistory()
  const description = watch('name')

  const clearAllFields = () => {
    setValue('name', '')
    setValue('cep', '')
    setValue('address', '')
    setValue('city', '')
    setValue('uf', '')
    setValue('cpfOrCnpj', '')
    setValue('email', '')
    setValue('phoneNumber', '')
    setValue('phoneNumberFixo', '')
    dispatch({
      type: LAYOUT_IS_MODIFIED_FIELDS,
      payload: {
        fields: {},
        url: '',
      },
    })
  }

  const onSubmit = async (data: ClientT) => {
    if (data.phoneNumber) {
      const validate = validateTwoPhoneTypes(data.phoneNumber)
      if (validate?.trim() !== '') {
        toast.error('Celular inválido')
        return
      }
    }
    if (data.phoneNumberFixo) {
      const validate = validateTwoPhoneTypes(data.phoneNumberFixo)
      if (validate?.trim() !== '') {
        toast.error('Telefone Fixo inválido')
        return
      }
    }

    data = {
      ...data,
      isSendFilesWhatsappNotification
    }

    try {
      setLoading(true)
      Loading.turnOn()
      await apiAdmin.post(`clients`, data)
      dispatch({
        type: CLIENT_FILTER,
        payload: {},
      })
      toast.success('Cliente cadastrado com sucesso!')
      if (isNewServiceByOS) {
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
      setLoading(false)
      Loading.turnOff()
      clearAllFields()
    }
  }

  const onGetCep = async ({ value }) => {
    const valueWithoutCharacters = clearSpecialCharacters(value)
    if (valueWithoutCharacters?.length === 8) {
      const { address, city, district, state, ok } = await getAddressByCEP(
        String(value).replace('.', ''),
      )
      if (!ok) {
        setValue('address', '')
        setValue('city', '')
        setValue('uf', '')
      } else {
        setValue('address', `${address} - ${district}`)
        setValue('city', city)
        setValue('uf', state)
      }
    }
  }

  const onValidateCPF_CNPJ = async ({ value }) => {
    const valueWithoutCharacters = clearSpecialCharacters(value)

    if (valueWithoutCharacters?.length === 11) {
      console.log({ validate: validateCpf(valueWithoutCharacters) })
      if (!validateCpf(valueWithoutCharacters)) {
        setError('cpfOrCnpj', { message: 'CPF inválido!' })
      } else {
        setError('cpfOrCnpj', { message: '' })
      }
    }
    if (valueWithoutCharacters?.length === 14) {
      if (!validateCNPJ(valueWithoutCharacters)) {
        setError('cpfOrCnpj', { message: 'CNPJ inválido!' })
      } else {
        setError('cpfOrCnpj', { message: '' })
      }
    }
  }

  const onHandleClose = () => {
    clearAllFields()
    if (isNewServiceByOS) {
      closeModal()
    } else {
      history.push(ADMINISTRATION_CLIENTS)
    }
  }

  useEffect(() => {
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
          description,
        },
        url: window.location.pathname,
      },
    })
  }, [description])

  return (
    <Container>
      {!!errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        {!!isNewServiceByOS && <div>Novo cliente</div>}
        <Row columns="1fr">
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputText label={'Nome'} field={field} fieldState={fieldState} />
            )}
          />
        </Row>
        <Row columns="2fr 6fr 4fr 1fr" marginTop="15px">
          <Controller
            name="cep"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputMask
                label="CEP"
                variant="outlined"
                mask="99.999-999"
                onKeyUp={() => onGetCep(field)}
                {...field}
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputText
                label="Endereço"
                field={field}
                fieldState={fieldState}
              />
            )}
          />
          <Controller
            name="city"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputText label="Cidade" field={field} fieldState={fieldState} />
            )}
          />
          <Controller
            name="uf"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputText label="UF" field={field} fieldState={fieldState} />
            )}
          />
        </Row>
        <Row columns="1fr 3fr 1fr 1fr" marginTop="15px">
          <Controller
            name="cpfOrCnpj"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputCPF_CNPJ
                label="CPF/CNPJ"
                onKeyUp={() => onValidateCPF_CNPJ(field)}
                fieldState={fieldState}
                {...field}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputText
                label="Email"
                field={field}
                fieldState={fieldState}
                toUpperCase={false}
              />
            )}
          />
          <Controller
            name="phoneNumber"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputPhone label="Celular" {...field} />
            )}
          />
          <Controller
            name="phoneNumberFixo"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputMask label="Fixo" mask="(99) 9999-9999" {...field} />
            )}
          />
        </Row>
        <Row columns="1fr" marginTop="15px" gap={1}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isSendFilesWhatsappNotification}
                  onChange={(event) => setIsSendFilesWhatsappNotification(event.target.checked)}
                  name="checkedA"
                  color='primary'
                />
              }
              label="Enviar arquivos na notificação no whatsapp"
            />
          </FormGroup>
          <FormHelperText style={{ position: 'relative', bottom: '21px' }}>Ao marcar essa opção o sistema irá enviar os arquivos junto com a mensagem de notificação no whatsapp, caso contrário irá enviar apenas a mensagem.</FormHelperText>
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

export default CreateClient
