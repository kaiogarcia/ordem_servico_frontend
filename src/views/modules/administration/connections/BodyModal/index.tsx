import { FormControlLabel, FormGroup, Switch } from '@mui/material'
import { AxiosError } from 'axios'
import { useFormik } from 'formik'
import React from 'react'
import { Button } from 'react-bootstrap'
import { useModal } from 'src/hooks/useModal'
import { InputText, Select } from '../../../../../components'
import { toast } from '../../../../../components/Widgets/Toastify'
import { useAdmin } from '../../../../../services/useAdmin'
import { toApi } from '../Adapters'
import { Form, Row } from './style'
import { ValidationForm } from './ValidationSchema'

const BodyModal: React.FC = () => {
  const [greetingMessage, setGreetingMessage] = React.useState('')
  const [queue, setQueue] = React.useState('')
  const [defaultNumber, setDefaultNumber] = React.useState(false)
  const { apiAdmin } = useAdmin()

  const { closeModal } = useModal()

  const handleSubmit = async (values) => {
    const dataToApi = toApi({
      greetingMessage: greetingMessage,
      connectionName: values.connectionName,
      queue: queue,
      defaultNumber: defaultNumber,
    })
    try {
      await apiAdmin.post(`connection-whats-app/create`, dataToApi)
      toast.success('Conexão cadastrada com sucesso!')
    } catch (error) {
      if (error) {
        const { response } = error as AxiosError
        if (response?.status !== 401) {
          if (Array.isArray(response?.data?.message)) {
            response?.data?.message.forEach((message: string) => {
              toast.error(message)
            })
          } else {
            toast.error(response?.data?.message)
          }
        }
      }
    } finally {
      closeModal()
    }
  }

  const onHidden = () => {
    closeModal()
  }

  const formik = useFormik({
    initialValues: { connectionName: '' },
    validationSchema: ValidationForm,
    onSubmit: handleSubmit,
  })

  return (
    <Form noValidate onSubmit={formik.handleSubmit} autoComplete="off">
      <Row>
        <InputText
          label="Nome da conexão"
          size="small"
          field={{}}
          error={formik.touched.connectionName && formik.errors.connectionName}
          name="connectionName"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          fullWidth={true}
          helperText={formik.errors.connectionName}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                name="defaultNumber"
                checked={defaultNumber}
                onChange={() => setDefaultNumber(!defaultNumber)}
              />
            }
            label="Padrão"
          />
        </FormGroup>
      </Row>
      <Row marginTop="5px">
        <InputText
          label="Mensagem de saudação"
          size="small"
          field={{}}
          multiline={true}
          rows={5}
          name="greetingMessage"
          setValue={setGreetingMessage}
          fullWidth={true}
        />
      </Row>
      <Row marginTop="10px">
        <Select
          label="Fila de atendimento"
          setValue={setQueue}
          options={[
            { label: 'Financeiro', value: 'Financeiro' },
            { label: 'RH', value: 'RH' },
          ]}
          size="small"
          fullWidth={true}
        />
      </Row>
      <Row marginTop="5px" justifyContent="flex-end" gap="5px">
        <Button onClick={onHidden}>Cancelar</Button>
        <Button disabled={formik.isSubmitting} variant="primary" type="submit">
          Adicionar
        </Button>
      </Row>
    </Form>
  )
}

export default BodyModal
