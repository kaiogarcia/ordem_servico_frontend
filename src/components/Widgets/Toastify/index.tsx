import { AxiosResponse } from 'axios'
import React from 'react'
import { toast as toastify } from 'react-toastify'
import { ReactComponent as ErrorIcon } from '../../../assets/icons/alerts/error.svg'
import { ReactComponent as SuccessIcon } from '../../../assets/icons/alerts/success.svg'
import { ReactComponent as WarningIcon } from '../../../assets/icons/alerts/warning.svg'
import Spinner from '../../Loader/Spinner'

const error = (message: string): React.ReactText => {
  return toastify.error(message, { icon: <ErrorIcon />, autoClose: 10000 },)
}

const success = (message: string): React.ReactText => {
  return toastify.success(message, { icon: <SuccessIcon />, autoClose: 10000 })
}

const warning = (message: string): React.ReactText => {
  return toastify.warning(message, { icon: <WarningIcon />, autoClose: 10000 })
}

const promise = (
  promise: Promise<AxiosResponse<any>>,
  messages: { pending: string; error: string; success: string },
): Promise<AxiosResponse<any>> => {
  return toastify.promise(
    promise,
    {
      pending: messages.pending,
      error: {
        render() {
          return messages.error
        },
        icon: <ErrorIcon />,
      },

      success: {
        render() {
          return messages.success
        },

        icon: <SuccessIcon />,
      },
    },
    { icon: <Spinner /> },
  )
}

export const toast = {
  error,
  success,
  warning,
  promise,
}
