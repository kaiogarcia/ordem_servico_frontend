import { Paper } from '@mui/material'
import React from 'react'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { usePermission } from 'src/hooks/usePermission'
import { ADMINISTRATION_EQUIPAMENTS_CREATE } from 'src/layouts/typePath'
import { EQUIPAMENT_FILTER } from 'src/store/actions'
import { EquipamentT } from 'src/store/Types'
import { Row } from 'src/styles'
import Button from '../../../../../components/Form/Button'
import InputText from '../../../../../components/Form/InputText/index_old'
import { EQUIPAMENTOS_INCLUIR } from '../../permissions/static/keysPermissions'
import { ButtonContainer, Container } from './styles'

const Filters: React.FC = () => {
  const { control, handleSubmit, reset } = useForm<EquipamentT>()

  const history = useHistory()
  const { hasPermission } = usePermission()
  const dispatch = useDispatch()

  const onSuccess = (response) => {
    const code = response.code; // Obtém o código de autorização
    console.log({ code })
  };
  const onFailure = (response) => {
    console.log({ response })
  };

  const onSubmitFilter = (data: EquipamentT) => {
    data = {
      ...data,
      equipamentName: data.equipamentName,
      brand: data.brand,
      model: data.model,
      serialNumber: data.serialNumber,
    }
    dispatch({
      type: EQUIPAMENT_FILTER,
      payload: data,
    })
  }

  const clearFilter = () => {
    reset()
    dispatch({
      type: EQUIPAMENT_FILTER,
      payload: {} as EquipamentT,
    })
  }

  return (
    <Container>
      <Paper elevation={1}>
        <form onSubmit={handleSubmit(onSubmitFilter)} autoComplete="off">
          <Row columns="repeat(4, 1fr)" gap={10}>
            <Controller
              name="equipamentName"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <InputText
                  label="Equipamento"
                  field={field}
                  fieldState={fieldState}
                />
              )}
            />
            <Controller
              name="brand"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <InputText
                  label="Marca"
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
                  label="Modelo"
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
                  label="Nº Série"
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
              onClick={() => history.push(ADMINISTRATION_EQUIPAMENTS_CREATE)}
              disabled={!hasPermission(EQUIPAMENTOS_INCLUIR)}
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
        {/* <GoogleOAuthProvider clientId="670748965702-v0f7s0mlsftr1aq27mvi7a4mf974oshc.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={credentialResponse => {
              console.log(credentialResponse);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </GoogleOAuthProvider> */}
      </Paper>
    </Container>
  )
}

export default Filters
