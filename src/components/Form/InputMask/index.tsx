import React, { InputHTMLAttributes } from 'react'
import { IMaskInput } from 'react-imask'
import ReactInputMask from 'react-input-mask'
import MsgError from 'src/components/MsgError'
import { Container } from './styles'

interface InputMaskProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  setValue?: (value: string) => void
  hasError?: boolean
  type?: string
  msgError?: string
  variation?: string
  mask: string
  value?: string
  disabled?: boolean
  useIMask?: boolean
  onBlur?: () => void
  onKeyUp?: () => void
  [x: string]: any
}

const InputMask: React.FC<InputMaskProps> = ({
  setValue,
  label,
  hasError,
  msgError,
  variation,
  mask,
  value,
  disabled,
  useIMask,
  children,
  ...rest
}) => {
  return (
    <Container
      hasError={msgError || hasError}
      variation={variation}
      isHasValue={value?.trim() ? true : false}
    >
      {label && <label htmlFor={label}>{label}</label>}
      {useIMask ? (
        <IMaskInput
          id={label}
          value={value}
          mask={mask}
          unmask={true}
          //disabled={disabled}
          onAccept={(value: any) => setValue && setValue(value)}
          {...rest}
        />
      ) : (
        <ReactInputMask
          value={value}
          mask={mask}
          id={label}
          disabled={disabled}
          onChange={(event) => setValue && setValue(event.target.value)}
          data-test={`inputMask-${label}`}
          {...rest}
        />
      )}
      {msgError && <MsgError>{msgError}</MsgError>}
    </Container>
  )
}

export default InputMask
