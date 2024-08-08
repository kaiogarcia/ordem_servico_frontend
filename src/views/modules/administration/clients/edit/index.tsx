/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
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
import { ADMINISTRATION_CLIENTS } from 'src/layouts/typePath'
import { useServiceCEP } from 'src/services/ServiceCEP'
import { useAdmin } from 'src/services/useAdmin'
import {
  CLIENT_FILTER,
  CLIENT_SEE_ALL,
  LAYOUT_MAKE_REQUEST,
} from 'src/store/actions'
import { ClientT } from 'src/store/Types'
import { Row } from 'src/styles'
import { schemaClient } from '../schemaValidation'
import { ButtonContainer, Container, Form } from './style'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import LockIcon from '@mui/icons-material/Lock'
import Tooltip from '@mui/material/Tooltip'
import { validateTwoPhoneTypes } from 'src/helpers/validateFields/validateTwoPhoneTypes'
import { ResponseApiClient } from 'src/views/modules/manager/serviceOrder/create/adapters/fromApi'
import { useModal } from 'src/hooks/useModal'
import { fromApi } from '../adapters'
import { Checkbox, FormControlLabel, FormGroup, FormHelperText } from '@mui/material'

type EditClientProps = {
  isNewServiceByOS?: boolean
  clientData?: ResponseApiClient
}

const EditClient: React.FC<EditClientProps> = ({
  isNewServiceByOS,
  clientData,
}) => {
  console.log(clientData)
  const dispatch = useDispatch()
  const { apiAdmin } = useAdmin()
  const { getAddressByCEP } = useServiceCEP()
  const history = useHistory()
  const [isSendFilesWhatsappNotification, setIsSendFilesWhatsappNotification] =
    useState(false)
  const location = !isNewServiceByOS ? useLocation() : null
  const [clientId, setClientId] = useState('')
  const [enableButtons, setEnableButton] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { closeModal } = useModal()

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ClientT>({
    shouldUnregister: false,
    resolver: yupResolver(schemaClient),
  })

  const getClients = async () => {
    try {
      const response = await apiAdmin.get(`clients`, {
        params: {
          name: undefined,
          cpfOrCnpj: undefined,
          phoneNumber: undefined,
          address: undefined,
          city: undefined,
          uf: undefined,
        },
      })
      dispatch({
        type: CLIENT_SEE_ALL,
        payload: await fromApi(response),
      })
    } catch (error) {
      toast.error(
        'Ops! Houve um erro ao tentar buscar os clientes, atualize a página e tente novamente.',
      )
    }
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
      await apiAdmin.put(`clients/${clientId}`, data)
      dispatch({
        type: CLIENT_FILTER,
        payload: {},
      })
      toast.success(`Cliente ${data.name} atualizado com sucesso.`)
      if (isNewServiceByOS) {
        await getClients()
        dispatch({
          type: LAYOUT_MAKE_REQUEST,
          payload: {
            makeRequest: Math.random(),
          },
        })
        closeModal()
      }
      history.push(ADMINISTRATION_CLIENTS)
    } catch (error) {
      if (isNewServiceByOS) {
        setErrorMessage(error?.response?.data.message)
      }
      exceptionHandle(error)
    } finally {
      setLoading(false)
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
    if (isNewServiceByOS) {
      closeModal()
    } else {
      history.push(ADMINISTRATION_CLIENTS)
    }
  }

  useEffect(() => {
    const {
      address,
      city,
      uf,
      cep,
      cpfOrCnpj,
      email,
      name,
      phoneNumber,
      id,
      phoneNumberFixo,
      idFolderClientName,
      idFolderOrcamento,
      idFolderOsUnificadas,
      idFolderOsPendentes,
      idFolderOsPagas,
      isSendFilesWhatsappNotification: _isSendFilesWhatsappNotification,
    } = !isNewServiceByOS ? location?.state : clientData

    setIsSendFilesWhatsappNotification(_isSendFilesWhatsappNotification)
    setValue('address', address)
    setValue('city', city)
    setValue('uf', uf)
    setValue('cep', cep)
    setValue('cpfOrCnpj', cpfOrCnpj)
    setValue('name', name)
    setValue('email', email)
    setValue('phoneNumber', phoneNumber)
    setValue('phoneNumberFixo', phoneNumberFixo)
    setValue('idFolderClientName', idFolderClientName)
    setValue('idFolderOrcamento', idFolderOrcamento)
    setValue('idFolderOsUnificadas', idFolderOsUnificadas)
    setValue('idFolderOsPendentes', idFolderOsPendentes)
    setValue('idFolderOsPagas', idFolderOsPagas)
    setClientId(id)
    scroll(0, 0)
  }, [])

  return (
    <Container>
      {!!errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        {!!isNewServiceByOS && <div>Editar</div>}
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
            render={({ field, fieldState, formState: { errors } }) => (
              <InputPhone
                label="Celular"
                {...field}
                hasError={!!errors.phoneNumber}
                msgError={errors.phoneNumber?.message}
              />
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
        {!isNewServiceByOS && (
          <Row marginTop="15px" display="flex" gap={1}>
            <div>
              <b>Atenção:</b> Realizar a alteração desses IDs abaixo somente
              quando a pasta não existir mais. Para habilitar os campos abaixo,
              clique aqui:
              <Tooltip
                title={
                  enableButtons ? 'Habilitar Campos' : 'Desabilitar Campos'
                }
              >
                <IconButton onClick={() => setEnableButton(!enableButtons)}>
                  <LockIcon />
                </IconButton>
              </Tooltip>
            </div>
          </Row>
        )}
        {!isNewServiceByOS && (
          <Row columns="repeat(5, 1fr)" marginTop="15px">
            <Controller
              name="idFolderClientName"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <InputText
                  label="ID Pasta do Cliente"
                  field={field}
                  fieldState={fieldState}
                  toUpperCase={false}
                  disabled={enableButtons}
                />
              )}
            />
            <Controller
              name="idFolderOrcamento"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <InputText
                  label="ID Pasta Orçamento"
                  field={field}
                  fieldState={fieldState}
                  toUpperCase={false}
                  disabled={enableButtons}
                />
              )}
            />
            <Controller
              name="idFolderOsPagas"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <InputText
                  label="ID Pasta Os Pagas"
                  field={field}
                  fieldState={fieldState}
                  toUpperCase={false}
                  disabled={enableButtons}
                />
              )}
            />
            <Controller
              name="idFolderOsPendentes"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <InputText
                  label="ID Pasta Os Pendentes"
                  field={field}
                  fieldState={fieldState}
                  toUpperCase={false}
                  disabled={enableButtons}
                />
              )}
            />
            <Controller
              name="idFolderOsUnificadas"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <InputText
                  label="ID Pasta Os Unificadas"
                  field={field}
                  fieldState={fieldState}
                  toUpperCase={false}
                  disabled={enableButtons}
                />
              )}
            />
          </Row>
        )}
        <Row columns="1fr" marginTop="15px" gap={1}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isSendFilesWhatsappNotification}
                  onChange={(event) =>
                    setIsSendFilesWhatsappNotification(event.target.checked)
                  }
                  name="checkedA"
                  color="primary"
                />
              }
              label="Enviar arquivos na notificação no whatsapp"
            />
          </FormGroup>
          <FormHelperText style={{ position: 'relative', bottom: '21px' }}>
            Ao marcar essa opção o sistema irá enviar os arquivos junto com a
            mensagem de notificação no whatsapp, caso contrário irá enviar
            apenas a mensagem.
          </FormHelperText>
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
            textButton={isNewServiceByOS ? 'Fechar' : 'Voltar'}
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

export default EditClient
