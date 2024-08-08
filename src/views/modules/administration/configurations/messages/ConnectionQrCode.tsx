/* eslint-disable react-hooks/exhaustive-deps */
import Alert from '@mui/material/Alert';
import React from 'react';
import { useModal } from 'src/hooks/useModal';
import { Container } from './style';

interface ConnectionQrCodeProps {
  qrCode: string
  webSocketState: string
}

const ConnectionQrCode: React.FC<ConnectionQrCodeProps> = ({ qrCode, webSocketState }) => {

  const { closeModal } = useModal()

  React.useEffect(() => {
    if (webSocketState === 'close') {
      closeModal()
    }
    if (webSocketState === 'open') {
      closeModal()
    }
    if (webSocketState === 'refused') {
      closeModal()
    }
  }, [webSocketState])

  return (
    <Container>
      <Alert severity="info">Conecte o aparelho celular ao QRCode abaixo</Alert>
      <img src={qrCode} alt='QrCode' />
    </Container>
  )
}

export default ConnectionQrCode
