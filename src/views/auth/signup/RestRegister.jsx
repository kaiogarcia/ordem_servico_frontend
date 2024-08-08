import React from 'react'
import { useHistory } from 'react-router-dom'
import { Row, Col, Button, Alert } from 'react-bootstrap'
import InputMask from 'react-input-mask'
import * as Yup from 'yup'
import { Formik } from 'formik'
import axios from 'axios'
import useScriptRef from '../../../hooks/useScriptRef'
import {
  API_SERVER_DEVELOPMENT,
  API_SERVER_PRODUTION,
} from '../../../config/constant'
import onlyNumbers from '../../../helpers/clear/onlyNumbers'
import { permissionsUser } from 'src/views/modules/administration/permissions/static'
import validateCpf from 'src/helpers/validateCpf'
import { toast } from 'src/components/Widgets/Toastify'
import { useAdmin } from 'src/services/useAdmin'

const RestRegister = ({ className, ...rest }) => {
  let history = useHistory()
  const { apiAdmin } = useAdmin()
  const scriptedRef = useScriptRef()
  //const { Loading } = useContext(LoadingContext)

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting },
  ) => {
    if (values.password.trim() !== values.confirmPassword.trim()) {
      const messageValidateError =
        'As senhas precisam ser iguais! Por favor verifique e digite novamente.'
      setErrors({
        password: messageValidateError,
        confirmPassword: messageValidateError,
      })
    } else {
      try {
        //Loading.turnOn()
        if (!validateCpf(values.cpf)) {
          toast.error('CPF inválido, tente novamente.')
          return
        }
        apiAdmin.post('users/create', {
          name: values.username,
          // email: values.email,
          cpf: String(onlyNumbers(values?.cpf)),
          password: values?.password,
          permissions: permissionsUser,
        }).then(function (response) {
            history.push('/auth/signin')
          })
          .catch(function (error) {
            setStatus({ success: false })
            setErrors({ submit: error.response.data.message })
            setSubmitting(false)
          })
      } catch (err) {
        console.error(err)
        if (scriptedRef.current) {
          setStatus({ success: false })
          setErrors({ submit: err.message })
          setSubmitting(false)
        }
      } finally {
        //Loading.turnOff()
      }
    }
  }

  return (
    <React.Fragment>
      <Formik
        initialValues={{
          username: '',
          //   email: '',
          password: '',
          cpf: '',
          confirmPassword: '',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          //   email: Yup.string()
          //     .email('Precisa ser um e-mail válido!')
          //     .max(255)
          //     .required('Email é obrigatório!'),
          username: Yup.string().required('Nome obrigatório!'),
          password: Yup.string().max(255).required('Senha obrigatório!'),
          cpf: Yup.string().max(255).required('CPF obrigatório!'),
          confirmPassword: Yup.string()
            .max(255)
            .required('Confirmação da senha obrigatório!'),
        })}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form
            noValidate
            onSubmit={handleSubmit}
            className={className}
            {...rest}
          >
            <div className="form-group mb-3">
              <input
                className="form-control"
                error={touched.username && errors.username}
                label="Nome completo"
                placeholder="Nome completo"
                name="username"
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                value={values.username}
              />
              {touched.username && errors.username && (
                <small className="text-danger form-text">
                  {errors.username}
                </small>
              )}
            </div>
            {/* <div className="form-group mb-3">
                            <input
                                className="form-control"
                                error={touched.email && errors.email}
                                label="Email"
                                placeholder="Email"
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="email"
                                value={values.email}
                            />
                            {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
                        </div> */}
            <div className="form-group mb-3">
              <InputMask
                mask="999.999.999-99"
                value={values.cpf}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {(inputProps) => (
                  <input
                    {...inputProps}
                    className="form-control"
                    error={touched.cpf && errors.cpf}
                    label="CPF"
                    placeholder="CPF"
                    name="cpf"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.cpf}
                  />
                )}
              </InputMask>
              {touched.cpf && errors.cpf && (
                <small className="text-danger form-text">{errors.cpf}</small>
              )}
            </div>
            <div className="form-group mb-4">
              <input
                className="form-control"
                error={touched.password && errors.password}
                label="Senha"
                placeholder="Senha"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
              />
              {touched.password && errors.password && (
                <small className="text-danger form-text">
                  {errors.password}
                </small>
              )}
            </div>
            <div className="form-group mb-4">
              <input
                className="form-control"
                error={touched.confirmPassword && errors.confirmPassword}
                label="Confirme a senha"
                placeholder="Confirme a senha"
                name="confirmPassword"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.confirmPassword}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <small className="text-danger form-text">
                  {errors.confirmPassword}
                </small>
              )}
            </div>

            {errors.submit && (
              <Col sm={12}>
                <Alert variant="danger">{errors.submit}</Alert>
              </Col>
            )}

            {/* <div className="custom-control custom-checkbox  text-left mb-4 mt-2">
                            <input type="checkbox" className="custom-control-input" id="customCheck1" />
                            <label className="custom-control-label" htmlFor="customCheck1">
                                Permanecer conectado.
                            </label>
                        </div> */}

            <Row>
              <Col mt={2}>
                <Button
                  className="btn-block"
                  color="primary"
                  disabled={isSubmitting}
                  size="large"
                  type="submit"
                  variant="primary"
                >
                  Cadastrar
                </Button>
              </Col>
            </Row>
          </form>
        )}
      </Formik>
      <hr />
    </React.Fragment>
  )
}

export default RestRegister
