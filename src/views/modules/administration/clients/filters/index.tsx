import { Paper } from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import clearSpecialCharacters from 'src/helpers/clearSpecialCharacters'
import { usePermission } from 'src/hooks/usePermission'
import { ADMINISTRATION_CLIENTS_CREATE } from 'src/layouts/typePath'
import { CLIENT_FILTER } from 'src/store/actions'
import { ClientT } from 'src/store/Types'
import { Row } from 'src/styles'
import Button from '../../../../../components/Form/Button'
import InputText from '../../../../../components/Form/InputText/index_old'
import { CLIENTES_INCLUIR } from '../../permissions/static/keysPermissions'
import { ButtonContainer, Container } from './styles'

const Filters: React.FC = () => {
  const { control, handleSubmit, reset, watch } = useForm<ClientT>()
  const { hasPermission } = usePermission()
  const history = useHistory()

  const dispatch = useDispatch()

  const onSubmitFilter = (data: ClientT) => {
    data = {
      ...data,
      cpfOrCnpj: clearSpecialCharacters(data.cpfOrCnpj),
      phoneNumber: clearSpecialCharacters(data.phoneNumber),
    }
    dispatch({
      type: CLIENT_FILTER,
      payload: data,
    })
  }

  const clearFilter = () => {
    reset()
    dispatch({
      type: CLIENT_FILTER,
      payload: {} as ClientT,
    })
  }

  return (
    <Container>
      <Paper elevation={1}>
        <form onSubmit={handleSubmit(onSubmitFilter)} autoComplete="off">
          <Row columns="2fr 1fr" gap={10}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <InputText label="Nome" field={field} fieldState={fieldState} />
              )}
            />
            <Controller
              name="cpfOrCnpj"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <InputText
                  label="CPF/CNPJ"
                  field={field}
                  fieldState={fieldState}
                />
              )}
            />
          </Row>
          <ButtonContainer>
            <Button
              textButton="Incluir"
              variant="outlined"
              size="medium"
              icon="add"
              onClick={() => history.push(ADMINISTRATION_CLIENTS_CREATE)}
              disabled={!hasPermission(CLIENTES_INCLUIR)}
            />
            <div>
              <Button
                textButton="Limpar Filtro "
                variant="outlined"
                color="error"
                onClick={() => clearFilter()}
              />
              <Button
                textButton="Filtrar Resultado"
                variant="outlined"
                type="submit"
              />
            </div>
          </ButtonContainer>
        </form>
      </Paper>
    </Container>
  )
}

export default Filters
