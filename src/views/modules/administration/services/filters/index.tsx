import { Paper } from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { usePermission } from 'src/hooks/usePermission'
import { ADMINISTRATION_SERVICES_CREATE } from 'src/layouts/typePath'
import { SERVICE_FILTER } from 'src/store/actions'
import { ServiceT } from 'src/store/Types'
import { Row } from 'src/styles'
import Button from '../../../../../components/Form/Button'
import InputText from '../../../../../components/Form/InputText/index_old'
import { SERVICOS_INCLUIR } from '../../permissions/static/keysPermissions'
import { ButtonContainer, Container } from './styles'

const Filters: React.FC = () => {
  const { control, handleSubmit, reset } = useForm<ServiceT>()

  const history = useHistory()

  const dispatch = useDispatch()
  const { hasPermission } = usePermission()

  const onSubmitFilter = (data: ServiceT) => {
    data = {
      ...data,
      description: data.description,
    }
    dispatch({
      type: SERVICE_FILTER,
      payload: data,
    })
  }

  const clearFilter = () => {
    reset()
    dispatch({
      type: SERVICE_FILTER,
      payload: {} as ServiceT,
    })
  }

  return (
    <Container>
      <Paper elevation={1}>
        <form onSubmit={handleSubmit(onSubmitFilter)} autoComplete="off">
          <Row columns="1fr" gap={10}>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <InputText label="Nome" field={field} fieldState={fieldState} />
              )}
            />
          </Row>
          <ButtonContainer>
            <Button
              textButton="Incluir"
              variant="outlined"
              size="medium"
              icon="add"
              onClick={() => history.push(ADMINISTRATION_SERVICES_CREATE)}
              disabled={!hasPermission(SERVICOS_INCLUIR)}
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
