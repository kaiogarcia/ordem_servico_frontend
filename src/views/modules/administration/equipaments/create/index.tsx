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
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { ADMINISTRATION_EQUIPAMENTS } from 'src/layouts/typePath'
import { useAdmin } from 'src/services/useAdmin'
import {
  EQUIPAMENT_FILTER,
  EQUIPAMENT_SEE_ALL,
  LAYOUT_IS_MODIFIED_FIELDS,
  LAYOUT_MAKE_REQUEST,
} from 'src/store/actions'
import { EquipamentT } from 'src/store/Types'
import { Row } from 'src/styles'
import { fromApi } from '../adapters'
import ConfirmationToSave from '../messages/ConfirmationToSave'
import { schemaBrand } from '../schemaValidation'
import { toApi } from './adapters'
import { ButtonContainer, Container, Form } from './style'

type CreateEquipamentProps = {
  isNewServiceByOS?: boolean
}

const CreateEquipament: React.FC<CreateEquipamentProps> = ({
  isNewServiceByOS,
}) => {
  const dispatch = useDispatch()
  const { apiAdmin } = useAdmin()
  const { closeModal, showMessage } = useModal()
  const { Loading } = useLoading()
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, setValue, watch } = useForm<EquipamentT>({
    shouldUnregister: false,
    resolver: yupResolver(schemaBrand),
  })

  const equipamentName = watch('equipamentName')
  const brand = watch('brand')
  const model = watch('model')
  const serialNumber = watch('serialNumber')

  const clearAllFields = () => {
    setValue('equipamentName', '')
    setValue('brand', '')
    setValue('model', '')
    setValue('serialNumber', '')
    dispatch({
      type: LAYOUT_IS_MODIFIED_FIELDS,
      payload: {
        fields: {},
        url: ''
      },
    })
  }

  const history = useHistory()

  const getEquipaments = async () => {
    try {
      const response = await apiAdmin.get(`equipaments`, {
        params: {
          equipamentName: undefined,
          brand: undefined,
          model: undefined,
          serialNumber: undefined,
        },
      })
      dispatch({
        type: EQUIPAMENT_SEE_ALL,
        payload: await fromApi(response),
      })
    } catch (error) {
      exceptionHandle(
        error,
        'Ops! Houve um erro ao tentar buscar os equipamentos, atualize a página e tente novamente.',
      )
    }
  }

  const onSubmit = async (data: EquipamentT) => {
    try {
      setLoading(true)
      Loading.turnOn()
      await apiAdmin.post(`equipaments`, toApi(data))
      dispatch({
        type: EQUIPAMENT_FILTER,
        payload: {},
      })
      toast.success('Equipamento cadastrado com sucesso.')
      if (isNewServiceByOS) {
        await getEquipaments()
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
    } finally {
      setLoading(false)
      Loading.turnOff()
      clearAllFields()
    }
  }

  const onHandleClose = () => {
    clearAllFields()
    if (isNewServiceByOS) {
      closeModal()
    } else {
      history.push(ADMINISTRATION_EQUIPAMENTS)
    }
  }

  React.useEffect(() => {
    scroll(0, 0)
  }, [])

  React.useEffect(() => {
    dispatch({
      type: LAYOUT_IS_MODIFIED_FIELDS,
      payload: {
        fields: {
          equipamentName,
          brand,
          model,
          serialNumber
        },
        url: window.location.pathname
      },
    })
  }, [equipamentName, brand, model, serialNumber])

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        {!!isNewServiceByOS && <div>Novo equipamento</div>}
        <Row columns="1fr">
          <Controller
            name="equipamentName"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputText
                label={'Equipamento'}
                field={field}
                fieldState={fieldState}
              />
            )}
          />
        </Row>
        <Row columns="repeat(3, 1fr)" marginTop="10px">
          <Controller
            name="brand"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputText
                label={'Marca'}
                field={field}
                fieldState={fieldState}
              />
            )}
          />
          <Controller
            name="model"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputText
                label={'Modelo'}
                field={field}
                fieldState={fieldState}
              />
            )}
          />
          <Controller
            name="serialNumber"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputText
                label={'Nº de série'}
                field={field}
                fieldState={fieldState}
              />
            )}
          />
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

export default CreateEquipament
