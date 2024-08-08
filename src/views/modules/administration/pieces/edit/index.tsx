/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { yupResolver } from '@hookform/resolvers/yup'
import { Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { InputText } from 'src/components'
import Button from 'src/components/Form/Button'
import { toast } from 'src/components/Widgets/Toastify'
import { exceptionHandle } from 'src/helpers/exceptions'
import { formatInputPrice, formatPrice } from 'src/helpers/formatPrice'
import { useModal } from 'src/hooks/useModal'
import { ADMINISTRATION_PIECES } from 'src/layouts/typePath'
import { useAdmin } from 'src/services/useAdmin'
import { LAYOUT_MAKE_REQUEST, PIECE_FILTER, PIECE_SEE_ALL } from 'src/store/actions'
import { PieceT } from 'src/store/Types'
import { Row } from 'src/styles'
import { fromApi } from '../adapters'
import { schemaPiece } from '../schemaValidation'
import { toApi } from './adapters'
import { ButtonContainer, Container, Form } from './style'

type EditPieceProps = {
  isNewServiceByOS?: boolean
  dataPiece?: any
}

const EditPiece: React.FC<EditPieceProps> = ({ isNewServiceByOS, dataPiece }) => {
  const urlPath = window.location.pathname
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  const { apiAdmin } = useAdmin()
  const location = !isNewServiceByOS ? useLocation() : null
  const [idPieces, setIdPieces] = useState()
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, setValue, watch } = useForm<PieceT>({
    shouldUnregister: false,
    resolver: yupResolver(schemaPiece),
  })

  const history = useHistory()
  const description = watch('description')
  const value = watch('value')

  useEffect(() => {
    scroll(0, 0)
    const { description, value, id, _id } = !isNewServiceByOS ? location?.state : dataPiece
    setValue('description', description)
    setValue('value', formatPrice(value))
    setIdPieces(id || _id)
    scroll(0, 0)
  }, [])

  const onFormatterPrice = (value: string) => {
    const { formated } = formatInputPrice(value)
    setValue('value', formated)
  }

  const getPieces = async () => {
    try {
      const response = await apiAdmin.get(`pieces`, {
        params: {
          description: undefined,
        },
      })
      dispatch({
        type: PIECE_SEE_ALL,
        payload: await fromApi(response),
      })
    } catch (error) {
      exceptionHandle(
        error,
        'Ops! Houve um erro ao tentar buscar as peças, atualize a página e tente novamente.',
      )
    }
  }

  const onSubmit = async (data: PieceT) => {
    try {
      setLoading(true)
      const { clean } = formatInputPrice(data?.value)
      await apiAdmin.put(`pieces/${idPieces}`, toApi(data, clean))
      dispatch({
        type: PIECE_FILTER,
        payload: {},
      })
      if (isNewServiceByOS) {
        await getPieces()
        dispatch({
          type: LAYOUT_MAKE_REQUEST,
          payload: {
            makeRequest: Math.random(),
          },
        })
        closeModal()
      }
      toast.success('Peça atualizada com sucesso.')
      history.push(ADMINISTRATION_PIECES)
    } catch (error) {
      exceptionHandle(error)
      if (isNewServiceByOS) {
        setErrorMessage(error?.response?.data.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const onHandleClose = () => {
    if (isNewServiceByOS) {
      closeModal()
    } else {
      history.push(ADMINISTRATION_PIECES)
    }
  }

  return (
    <Container>
      {!!errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        {!!isNewServiceByOS && <div>Editar</div>}
        <Row columns="5fr 1fr">
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
                label={'Preço'}
                field={field}
                fieldState={fieldState}
                onKeyUp={() => onFormatterPrice(field.value)}
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

export default EditPiece
