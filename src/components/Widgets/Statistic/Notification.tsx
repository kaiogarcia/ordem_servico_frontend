import React from 'react'
import { Alert } from 'react-bootstrap'

interface NotificationProps {
  variant?: variantType
  message: string
  link?: string
  alertMessage?: string
}

type variantType =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'

const Notification: React.FC<NotificationProps> = (props) => {
  return (
    <React.Fragment>
      <Alert variant={props.variant || 'primary'}>
        {props.message}
        <Alert.Link href={props.link} target="_blank" className="float-right">
          {props.alertMessage}
        </Alert.Link>
      </Alert>
    </React.Fragment>
  )
}

export default Notification
