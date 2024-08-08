import { QRCodeSVG } from 'qrcode.react'
import React, { useEffect } from 'react'
import { Notification } from 'src/components'
import { useAuth } from 'src/hooks/useAuth'
import { useModal } from 'src/hooks/useModal'
import { socket } from 'src/services/Socket'
import { Container } from './styles'

interface QrCodeModalprops {
  qrCode: string
}

const QrCodeModalContent: React.FC<QrCodeModalprops> = ({ qrCode }) => {
  const { closeModal } = useModal()
  const { user } = useAuth()

  useEffect(() => {
    // socket.on(`${CONNECTION_SERVICE_GETCONNECTION_AUTHENTICATED}-${user.user.cpf}`, (data) => {
    //   if (data?.status === 'authenticated') {
    //     closeModal()
    //   }
    // })
    // socket.on(`${CONNECTION_SERVICE_GETCONNECTION_CLIENT_READY}-${user.user.cpf}`, (data) => {
    //   if (data?.status === 'ready') {
    //     closeModal()
    //   }
    //   if (data?.status === 'desconnected') {
    //     closeModal()
    //   }
    // })
  }, [])

  return (
    <Container>
      <Notification message="Abra o WhatsApp no seu telefone e aponte para esta tela para capturar o código." />
      {/* <QRCodeSVG value={qrCode} /> */}
      <img src={qrCode}></img>
    </Container>
  )
}

export default QrCodeModalContent
