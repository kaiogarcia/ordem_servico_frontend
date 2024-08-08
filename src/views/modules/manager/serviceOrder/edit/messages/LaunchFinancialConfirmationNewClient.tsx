import React, { useState } from 'react'
import { Button } from 'src/components'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { MANAGER_SERVICE_ORDER } from 'src/layouts/typePath'
import {
  ButtonLaunchFinancialConfirmationContainer,
  LaunchFinancialConfirmationContainer,
} from './style'

type LaunchFinancialConfirmationProps = {
  history: any
  resetAllField: () => void
}

export const LaunchFinancialConfirmationNewClient: React.FC<
  LaunchFinancialConfirmationProps
> = ({ history }) => {
  const { closeModal } = useModal()
  const { Loading } = useLoading()
  const [loading, setLoading] = useState(false)

  const newOS = () => {
    setLoading(true)
    Loading.turnOn()
    window.location.reload()
  }

  const redirectListOS = () => {
    history.push(MANAGER_SERVICE_ORDER)
    closeModal()
    window.localStorage.removeItem('client')
    window.localStorage.removeItem('clickedClientName')
  }

  return (
    <LaunchFinancialConfirmationContainer>
      <div>Deseja continuar com o mesmo cliente da O.S anterior?</div>
      <ButtonLaunchFinancialConfirmationContainer>
        <Button
          textButton="Sim"
          variant="outlined"
          size="large"
          icon="add2"
          onClick={newOS}
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
