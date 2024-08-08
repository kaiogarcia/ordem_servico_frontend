/* eslint-disable react-hooks/exhaustive-deps */
import { Paper } from '@mui/material'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import hasNumber from 'src/helpers/hasNumber'
import { usePermission } from 'src/hooks/usePermission'
import { MANAGER_SERVICE_ORDER_CREATE } from 'src/layouts/typePath'
import { MODEL_FILTER } from 'src/store/actions'
import { ModelT } from 'src/store/Types'
import { Row } from 'src/styles'
import { ORDEM_SERVICO_INCLUIR } from 'src/views/modules/administration/permissions/static/keysPermissions'
import Button from '../../../../../components/Form/Button'
import InputText from '../../../../../components/Form/InputText/index_old'
import { OSData } from '../../serviceOrder/create/type'
import { ButtonGenerateOSContainer } from '../Table/Styles'
import { ButtonContainer, Container } from './styles'

type FiltersProps = {
  onHandleGenerateOS: () => void
  selectedAllRowIds: string[]
  serviceOrdersStore: OSData[]
  setDataListTable: React.Dispatch<React.SetStateAction<OSData[]>>
}

const Filters: React.FC<FiltersProps> = ({
  onHandleGenerateOS,
  selectedAllRowIds,
  setDataListTable,
  serviceOrdersStore,
}) => {
  const { control, handleSubmit, reset, watch, setValue } = useForm<ModelT>()
  const history = useHistory()
  const dispatch = useDispatch()
  const clientNameOrOsNumber = watch('description')
  const { hasPermission } = usePermission()
  const osDataAdded = JSON.parse(window.localStorage.getItem('osDataAdded'))
  const oSData = JSON.parse(window.localStorage.getItem('oSData'))
  const [isDisabledButtonGenerate, setIsDisableButtonGenerate] = useState(false)

  const onSubmitFilter = (data: ModelT) => {
    data = {
      ...data,
      description: data.description,
    }
    dispatch({
      type: MODEL_FILTER,
      payload: data,
    })
  }

  const clearFilter = () => {
    reset()
    dispatch({
      type: MODEL_FILTER,
      payload: {} as ModelT,
    })
  }

  const filterData = (clientNameOrOsNumber: string) => {
    if (hasNumber(clientNameOrOsNumber)) {
      setDataListTable(() => [
        ...serviceOrdersStore.filter((item) =>
          item?.osNumber
            .toUpperCase()
            .trim()
            .includes(clientNameOrOsNumber.toUpperCase().trim()),
        ),
      ])
    } else {
      setDataListTable(() => [
        ...serviceOrdersStore.filter((item) =>
          item?.client?.name
            .toUpperCase()
            .trim()
            .includes(clientNameOrOsNumber.toUpperCase().trim()),
        ),
      ])
    }
  }

  React.useEffect(() => {
    if (clientNameOrOsNumber) {
      filterData(clientNameOrOsNumber)
      setValue('description', clientNameOrOsNumber)
    } else {
      setDataListTable(serviceOrdersStore)
    }
    return () => {
      clearFilter()
    }
  }, [clientNameOrOsNumber])

  React.useEffect(() => {
    if (osDataAdded) {
      setIsDisableButtonGenerate(true)
      if (osDataAdded?.length === oSData?.length) {
        setIsDisableButtonGenerate(false)
      }
    }
  }, [osDataAdded])

  return (
    <Container>
      <Paper elevation={1}>
        <form onSubmit={handleSubmit(onSubmitFilter)} autoComplete="off">
          <Row columns="1fr">
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <InputText
                  label="Cliente/Nº OS"
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
              onClick={() => history.push(MANAGER_SERVICE_ORDER_CREATE)}
              disabled={!hasPermission(ORDEM_SERVICO_INCLUIR)}
            />
            {!!selectedAllRowIds?.length && (
              <ButtonGenerateOSContainer>
                <Button
                  textButton={isDisabledButtonGenerate ? 'Aguarde...' : `Gerar (${selectedAllRowIds?.length})`}
                  variant="contained"
                  onClick={onHandleGenerateOS}
                  size="medium"
                  icon="doc"
                  disabled={isDisabledButtonGenerate}
                />
              </ButtonGenerateOSContainer>
            )}
          </ButtonContainer>
        </form>
      </Paper>
    </Container>
  )
}

export default Filters
