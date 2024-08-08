/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { InputText } from 'src/components'
import Button from 'src/components/Form/Button'
import { Select } from 'src/components/Widgets/Select'
import { toast } from 'src/components/Widgets/Toastify'
import { exceptionHandle } from 'src/helpers/exceptions'
import { useLoading } from 'src/hooks/useLoading'
import { ADMINISTRATION_SEE_ALL_PERMISSIONS } from 'src/layouts/typePath'
import { useAdmin } from 'src/services/useAdmin'
import { LAYOUT_MAKE_REQUEST } from 'src/store/actions'
import { Row } from 'src/styles'
import { schemaUser } from '../schemaValidation'
import { PermissionUser, User } from '../type'
import { toApi } from './adapters'
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { ButtonContainer, Container, Form } from './style'
import { Permissions } from '../components/Permissions'
import InputMask from 'src/components/Form/InputMask'
import { permissionsUser } from "../static";
import validateCpf from 'src/helpers/validateCpf'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const EditUserWithPermission: React.FC = () => {
  const dispatch = useDispatch()
  const { apiAdmin } = useAdmin()
  const { Loading } = useLoading()
  const location = useLocation()?.state
  const [valueTab, setValueTab] = React.useState(0);
  const [permissionValues, setPermissionsValues] = React.useState<PermissionUser[]>([] as PermissionUser[])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };

  const { control, handleSubmit, setValue, getValues, watch } = useForm<User>({
    shouldUnregister: false,
    resolver: yupResolver(schemaUser),
  })

  const history = useHistory()
  const typeUser = watch('typeUser')

  const onHandleClose = () => {
    history.push(ADMINISTRATION_SEE_ALL_PERMISSIONS)
  }

  const onSubmit = async () => {

    if (typeUser === 'USER') {
      if (!permissionValues.length) {
        toast.error('Permissões obrigatórias!')
        return
      }
    }

    if (!validateCpf(getValues('cpf'))) {
      toast.error('CPF inválido! Verifique e digite novamente.')
      return
    }

    const data: User = {
      name: getValues('name'),
      email: getValues('email'),
      cpf: getValues('cpf'),
      password: getValues('password'),
      typeUser: getValues('typeUser'),
      id: undefined,
      status: 'ATIVO',
      permissions: typeUser === 'ADMIN' ? permissionsUser : (permissionValues || location?.permissions)
    }

    try {
      Loading.turnOn()
      await apiAdmin.put(`users/update/${location?.id}`, toApi(data))
      toast.success('Usuário atualizado com sucesso.')
      dispatch({
        type: LAYOUT_MAKE_REQUEST,
        payload: {
          makeRequest: Math.random(),
        },
      })
      onHandleClose()
    } catch (error) {
      exceptionHandle(error)
    } finally {
      Loading.turnOff()
    }
  }


  // function generateSequence(): string {
  //   let sequence = "";
  //   for (let i = 0; i < 4; i++) {
  //     const digit = Math.floor(Math.random() * 10);
  //     sequence += digit.toString();
  //   }
  //   return sequence;
  // }

  const mappedPermissions = () => {
    const permissions = location?.permissions
    return permissions.map((permission) => {
      return {
        name: permission.name,
        key: permission.key
      }
    })
  }

  React.useEffect(() => {
    scroll(0, 0)
    const { name, email, cpf, password, typeUser } = location
    setValue('name', name)
    setValue('email', email)
    setValue('cpf', String(cpf))
    setValue('password', password)
    setValue('typeUser', typeUser)
  }, [location])

  return (
    <Container>
      <Tabs value={valueTab} onChange={handleChange}>
        <Tab label="Dados Cadastrais" {...a11yProps(0)} />
        {typeUser === 'USER' && <Tab label="Permissões" {...a11yProps(1)} />}
      </Tabs>
      <TabPanel value={valueTab} index={0}>
        <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Row columns="1fr">
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <InputText
                  label={'Nome Completo:'}
                  field={field}
                  fieldState={fieldState}
                />
              )}
            />
          </Row>
          <Row columns="repeat(4, 1fr)" marginTop="10px">
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <InputText
                  label={'E-mail:'}
                  field={field}
                  fieldState={fieldState}
                  toUpperCase={false}
                />
              )}
            />
            <Controller
              name="cpf"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <InputMask
                  mask='999.999.999-99'
                  label={'CPF:'}
                  value={field.value}
                  setValue={(data) => setValue('cpf', data)}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue={''}
              render={({ field, fieldState }) => (
                <InputText
                  label={'Senha:'}
                  field={field}
                  fieldState={fieldState}
                  toUpperCase={false}
                />
              )}
            />
            <Controller
              name="typeUser"
              control={control}
              defaultValue="USER"
              render={({ field, fieldState }) => (
                <Select
                  label={'Tipo Usuário:'}
                  value={field.value}
                  setValue={(previousState) =>
                    setValue('typeUser', previousState)
                  }
                  options={[
                    { label: 'Operador', value: 'USER' },
                    { label: 'Administrador', value: 'ADMIN' }
                  ]}
                  hasError={!!fieldState.error}
                  msgError={fieldState.error?.message}
                />
              )}
            />
          </Row>
          {typeUser === 'USER' && <ButtonContainer>
            <Button
              textButton="Adicionar Permissões"
              variant="contained"
              size="large"
              icon="add"
              onClick={() => handleChange(null, 1)}
            />
          </ButtonContainer>}
          {typeUser === 'ADMIN' &&
            <Row justifyContent="center" alignItems="center">
              <ButtonContainer>
                <Button
                  textButton="Salvar"
                  variant="contained"
                  size="large"
                  icon="add3"
                  onClick={onSubmit}
                />
                <Button
                  textButton="Cancelar"
                  variant="outlined"
                  size="large"
                  icon="back"
                  onClick={onHandleClose}
                />
              </ButtonContainer>
            </Row>
          }
        </Form>
      </TabPanel>
      <TabPanel value={valueTab} index={1}>
        <Permissions onSubmit={onSubmit} setPermissionsValues={setPermissionsValues} targetPermission={mappedPermissions()} />
      </TabPanel>
    </Container>
  )
}

export default EditUserWithPermission
