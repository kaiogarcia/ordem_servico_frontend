import React, { useState } from 'react'
import {
  Container,
  ContainerButtonToSaveText,
  ContainerCheckBox,
  ContainerOption,
  HelperText,
} from '../../style'
import {
  Alert,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  TextField,
} from '@mui/material'
import { useAdmin } from 'src/services/useAdmin'
import { exceptionHandle } from 'src/helpers/exceptions'
import Button from 'src/components/Form/Button'

interface ConfigurationsMessagesTextProps {
  isEnableSendNotificationMessage: boolean
  isEnableSendNotificationMessageStatusRecebido: boolean
  textToSendNotificationMessageStatusRecebido: string
  setTextToSendNotificationMessageStatusRecebido: React.Dispatch<
    React.SetStateAction<string>
  >
  setIsEnableSendNotificationMessageStatusRecebido: React.Dispatch<
    React.SetStateAction<boolean>
  >
  onHandleChangeSendNotificationMessage: (event: any) => void
  onHandleChangeSendNotificationMessageStatusRecebido: (event: any) => void
  onHandleChangeSendNotificationTextMessageStatusRecebido: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void
  onHandleChangeSendNotificationMessageStatusRecebidoButton: (
    textToSendNotificationMessageStatusRecebido: string,
    isEnableSendNotificationMessageStatusRecebido: boolean,
  ) => Promise<void>
}

export const ConfigurationsMessagesText: React.FC<
  ConfigurationsMessagesTextProps
> = ({
  isEnableSendNotificationMessage,
  textToSendNotificationMessageStatusRecebido,
  isEnableSendNotificationMessageStatusRecebido,
  onHandleChangeSendNotificationMessage,
  onHandleChangeSendNotificationMessageStatusRecebido,
  onHandleChangeSendNotificationTextMessageStatusRecebido,
  setIsEnableSendNotificationMessageStatusRecebido,
  setTextToSendNotificationMessageStatusRecebido,
  onHandleChangeSendNotificationMessageStatusRecebidoButton,
}) => {
  const { apiAdmin } = useAdmin()
  const [isShowButton, setIsShowButton] = useState(false)

  const getConfigurations = async () => {
    try {
      const { data } = await apiAdmin.get('configurations')
      if (data.length) {
        console.log(data[0])
        setIsEnableSendNotificationMessageStatusRecebido(
          data[0]?.isEnableSendNotificationMessageStatusRecebido,
        )
        setTextToSendNotificationMessageStatusRecebido(
          data[0]?.textToSendNotificationMessageStatusRecebido,
        )
      }
    } catch (error) {
      exceptionHandle(error)
    }
  }

  const showButton = () => {
    setIsShowButton(true)
  }

  const onHandleSaveConfigStatusRecebidoMessage = () => {
    onHandleChangeSendNotificationMessageStatusRecebidoButton(
      textToSendNotificationMessageStatusRecebido,
      isEnableSendNotificationMessageStatusRecebido,
    )
  }

  React.useEffect(() => {
    getConfigurations()
  }, [])

  return (
    <Container>
      <Paper elevation={3}>
        <Alert severity="info">
          Ao marcar essa opção o sistema irá enviar uma mensagem de texto no
          whatsapp do cliente quando o status da ordem de serviço for de{' '}
          <b>PENDENTE</b> para <b>RECEBIDO.</b>
          <HelperText>Utilize a variável <b>@os</b> para vincular o número da ordem de serviço dinamicamente.</HelperText>
        </Alert>
        <ContainerCheckBox>
          <FormGroup>
            <ContainerOption>
              <Card>
                <FormControlLabel
                  control={
                    <ContainerOption>
                      <Checkbox
                        checked={isEnableSendNotificationMessageStatusRecebido}
                        onChange={(event) =>
                          onHandleChangeSendNotificationMessageStatusRecebido(
                            event,
                          )
                        }
                      />
                    </ContainerOption>
                  }
                  label={
                    'Enviar mensagem de notificação quando o status da OS for alterado para recebido?'
                  }
                  value={isEnableSendNotificationMessageStatusRecebido}
                />
              </Card>
            </ContainerOption>
          </FormGroup>
          <ContainerOption>
            <TextField
              label="Texto"
              multiline
              size="small"
              fullWidth
              focused
              value={textToSendNotificationMessageStatusRecebido}
              onChange={(event) => {
                onHandleChangeSendNotificationTextMessageStatusRecebido(event)
                showButton()
              }}
            />
            {!!isShowButton && (
              <ContainerButtonToSaveText>
                <Button
                  textButton={'Salvar alterações do texto'}
                  variant="contained"
                  icon="update"
                  onClick={onHandleSaveConfigStatusRecebidoMessage}
                />
              </ContainerButtonToSaveText>
            )}
          </ContainerOption>
        </ContainerCheckBox>
      </Paper>
      <Paper elevation={3}>
        <Alert severity="info">
          Ao marcar essa opção o sistema não irá enviar a mensagem de
          notificação no Whatsapp e no E-mail após realizar a importação dos
          arquivos.
        </Alert>
        <ContainerCheckBox>
          <FormGroup>
            <ContainerOption>
              <Card>
                <FormControlLabel
                  control={
                    <ContainerOption>
                      <Checkbox
                        checked={isEnableSendNotificationMessage}
                        onChange={(event) =>
                          onHandleChangeSendNotificationMessage(event)
                        }
                      />
                    </ContainerOption>
                  }
                  label={
                    'Não enviar mensagem de notificação após a importação dos arquivos.'
                  }
                  value={isEnableSendNotificationMessage}
                />
              </Card>
            </ContainerOption>
          </FormGroup>
        </ContainerCheckBox>
      </Paper>
    </Container>
  )
}
