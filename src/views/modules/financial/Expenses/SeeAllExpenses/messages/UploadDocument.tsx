/* eslint-disable react-hooks/exhaustive-deps */
import { Alert } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Button from 'src/components/Form/Button'
import { UploadWithTemplate } from 'src/components/Upload/UploadWithTemplate'
import { useAuth } from 'src/hooks/useAuth'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { LAYOUT_MAKE_REQUEST } from 'src/store/actions'
import { ButtonGroup, Container, Text } from './style'

const UploadDocument: React.FC<any> = ({
  setMakeRequest
}) => {
  const { closeModal } = useModal()
  const { user } = useAuth()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { Loading } = useLoading()

  React.useEffect(() => {
    setMakeRequest && setMakeRequest(Math.random())
    dispatch && dispatch({
      type: LAYOUT_MAKE_REQUEST,
      payload: {
        makeRequest: Math.random(),
      },
    })
  }, [])

  const callMakeRequest = async () => {
    setMakeRequest(Math.random())
  }

  const onClose = () => {
    Loading.turnOn()
    setLoading(true)
    setTimeout(async () => {
      closeModal()
      Loading.turnOff()
      setLoading(false)
      await callMakeRequest()
    }, 6000)
  }

  return (
    <Container isUseWidth>
      <Text alignSelf="center" fontSize="20px" bold>
        Importação de extrato Nubank
      </Text>
      {!loading && <Alert severity="info">
        Para evitar duplicidade de dados só será permitido o envio de um arquivo por vez.
      </Alert>}
      {loading && <Alert severity="info">
        Processando os dados, aguarde...
      </Alert>}
      <UploadWithTemplate endpoint={`http://${user?.user?.ip}:${process.env.REACT_APP_PORT_BACKEND}/nubank/upload/extract`}
        closeModal={onClose}
        accept='.csv'
        multiple
        disabled={loading}
        call={callMakeRequest}
      />
      <ButtonGroup>
        <Button
          textButton="Fechar"
          variant="outlined"
          icon="close"
          onClick={() => closeModal()}
          loading={loading}
        />
      </ButtonGroup>
    </Container>
  )
}

export default UploadDocument
