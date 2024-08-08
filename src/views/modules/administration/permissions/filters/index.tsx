import { Paper } from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { usePermission } from 'src/hooks/usePermission'
import { ADMINISTRATION_MANAGER_USER_CREATE } from 'src/layouts/typePath'
import { Row } from 'src/styles'
import Button from '../../../../../components/Form/Button'
import InputText from '../../../../../components/Form/InputText/index_old'
import { GESTAO_USUARIOS_INCLUIR } from '../static/keysPermissions'
import { User } from '../type'
import { ButtonContainer, Container } from './styles'

type FiltersProps = {
  setUserFiltered: React.Dispatch<React.SetStateAction<User>>
}

const Filters: React.FC<FiltersProps> = ({ setUserFiltered }) => {
  const { control, handleSubmit, reset } = useForm<User>()

  const history = useHistory()
  const { hasPermission } = usePermission()

  const onSubmitFilter = (data: User) => {
    data = {
      ...data,
      name: data.name,
    }
    setUserFiltered(data)
  }

  const clearFilter = () => {
    reset()
    setUserFiltered({} as User)
  }

  return (
    <Container>
      <Paper elevation={1}>
        <form onSubmit={handleSubmit(onSubmitFilter)} autoComplete="off">
          <Row columns="repeat(1, 1fr)" gap={10}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <InputText
                  label="Nome:"
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
              onClick={() => history.push(ADMINISTRATION_MANAGER_USER_CREATE)}
              disabled={!hasPermission(GESTAO_USUARIOS_INCLUIR)}
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
