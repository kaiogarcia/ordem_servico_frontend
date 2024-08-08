import React, { useState } from 'react'
import { Button } from 'src/components'
import { useModal } from 'src/hooks/useModal'
import { MANAGER_SERVICE_ORDER } from 'src/layouts/typePath'
import { LaunchFinancialConfirmationNewClient } from './LaunchFinancialConfirmationNewClient'
import {
  ButtonLaunchFinancialConfirmationContainer,
  LaunchFinancialConfirmationContainer,
} from './style'

type LaunchFinancialConfirmationProps = {
  history: any
  resetAllField: () => void
}

export const LaunchFinancialConfirmation: React.FC<
  LaunchFinancialConfirmationProps
> = ({ history }) => {
  const { closeModal, showMessage } = useModal()
  const [loading, setLoading] = useState(false)

  const confirmation = () => {
    showMessage(LaunchFinancialConfirmationNewClient, { history }, true)
    setLoading(true)
  }

  const redirectListOS = () => {
    history.push(MANAGER_SERVICE_ORDER)
    closeModal()
    window.localStorage.removeItem('client')
    window.localStorage.removeItem('clickedClientName')
  }

  return (
    <LaunchFinancialConfirmationContainer>
      <div>Deseja Iniciar Uma Nova OS?</div>
      <ButtonLaunchFinancialConfirmationContainer>
        <Button
          textButton="Sim"
          variant="outlined"
          size="large"
          icon="add2"
          onClick={confirmation}
          loading={loading}
        />
        <Button
          textButton="Não"
          variant="outlined"
          size="large"
          icon="close"
          color="error"
          onClick={redirectListOS}
        />
      </ButtonLaunchFinancialConfirmationContainer>
    </LaunchFinancialConfirmationContainer>
  )
}
