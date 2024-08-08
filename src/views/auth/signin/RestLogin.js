import axios from 'axios'
import { Formik } from 'formik'
import jwt from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import {
  API_SERVER_DEVELOPMENT,
  API_SERVER_PRODUTION,
} from '../../../config/constant'
import { useAuth } from '../../../hooks/useAuth'
import { useLoading } from '../../../hooks/useLoading'
import useScriptRef from '../../../hooks/useScriptRef'
import InputMask from 'react-input-mask'
import clearSpecialCharacters from 'src/helpers/clearSpecialCharacters'
import { LAYOUT_IS_MODIFIED_FIELDS } from 'src/store/actions'
import { socket } from 'src/services/Socket'

const RestLogin = ({ className, ...rest }) => {
  const dispatch = useDispatch()
  const scriptedRef = useScriptRef()
  const { setUserData } = useAuth()
  const { Loading } = useLoading()
  const [ip, setIp] = useState('')

  // useEffect(() => {
  //   socket.on('ip-address', (data) => {
  //     setIp(data.ip)
  //   })
  // }, [])

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting },
  ) => {
    try {
      Loading.turnOn()
      setSubmitting(true)
      axios
        .post(
          `${API_SERVER_DEVELOPMENT || API_SERVER_PRODUTION}users/auth/login`,
          {
            password: values.password,
            username: clearSpecialCharacters(values.cpf),
          },
        )
        .then(function (response) {
          const dataUser = jwt(response.data.access_token)
          setUserData(dataUser, response.data.access_token)
          if (scriptedRef.current) {
            setStatus({ success: true })
            setSubmitting(false)
          }
        })
        .catch(function (error) {
          setStatus({ success: false })
          setSubmitting(false)
          const statusCode = error?.response?.data?.statusCode
          if (statusCode !== 500) {
            if (statusCode === 401) {
              if (error?.response?.data?.message === 'Acesso bloqueado!') {
                setErrors({
                  submit: 'Acesso bloqueado.',
                })
              } else {
                setErrors({
                  submit:
                    'Usuário e/ou senha incorretos ou esse usuário não existe.',
                })
              }
            } else {
              setErrors({ submit: error?.response?.data?.message })
            }
          } else {
            setErrors({
              submit:
                'Ops! Houve um erro ao tentar entrar no sistema, por favor entre em contato com o suporte técnico.',
            })
          }
        })
    } catch (err) {
      if (scriptedRef.current) {
        setStatus({ success: false })
        setErrors({ submit: err.message })
        setSubmitting(false)
      }
    } finally {
      Loading.turnOff()
      setSubmitting(false)
      dispatch({
        type: LAYOUT_IS_MODIFIED_FIELDS,
        payload: {
          fields: {},
          url: '',
        },
      })
    }
  }

  return (
    <React.Fragment>
      <Formik
        initialValues={{
          cpf: '',
          password: '',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          cpf: Yup.string().required('CPF obrigatório!'),
          password: Yup.string().max(255).required('Senha obrigatória!'),
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
              {/* <input
                className="form-control"
                error={touched.email && errors.email}
                label="Email"
                placeholder="Email"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                value={values.email}
              /> */}
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

            {errors.submit && (
              <Col sm={12}>
                <Alert variant="danger">{errors.submit}</Alert>
              </Col>
            )}

            {/* <div className="custom-control custom-checkbox  text-left mb-4 mt-2">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
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
                  Entrar
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

export default RestLogin
