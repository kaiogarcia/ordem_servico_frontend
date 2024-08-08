import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { Button, Notification } from '../../../../components'
import { useModal } from '../../../../hooks/useModal'
import BodyModal from './BodyModal'
import TableView from './Table'

const ConnectionWhatsApp: React.FC = () => {
  const [isMessageError, setIsMessageError] = React.useState(false)
  const { showMessage } = useModal()

  const handleClickAddWhatsApp = () => {
    showMessage(BodyModal, {}, true)
  }

  return (
    <React.Fragment>
      <span className="d-block m-t-10">
        <Row>
          <Col sm={12}>
            <Notification
              message="Dica: Você pode adicionar números por departamentos para poder ter um melhor gereciamento.
                            Para saber mais como conectar o WhatsApp, assista o vídeo que preparamos pra você."
              link="https://react-bootstrap.github.io/components/buttons/"
              alertMessage="Clique aqui!"
            />
            <Notification
              message="Dica: Se preferir, você também pode unificar os números cadastrados nessa página nos atendimentos,
                            dessa forma evita chance de bloqueios, clicando na sessão de configurações. Ou se preferir, assista o vídeo que ensinamos o passo a passo."
              link="https://react-bootstrap.github.io/components/buttons/"
              alertMessage="Clique aqui!"
            />
            {isMessageError && (
              <Notification
                message="Houve um problema na conexão, por favor, tente novamente."
                variant="danger"
              />
            )}
          </Col>
        </Row>
      </span>
      <Button
        variant="outlined"
        onClick={handleClickAddWhatsApp}
        textButton="Adicionar WhatsApp"
        icon={'whatsApp'}
        color="success"
        size="small"
      />
      <TableView setIsMessageError={setIsMessageError} />
    </React.Fragment>
  )
}

export default ConnectionWhatsApp
