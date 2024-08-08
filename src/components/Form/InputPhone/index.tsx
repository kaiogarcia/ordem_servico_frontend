import React, { InputHTMLAttributes } from 'react'
import ReactInputMask from 'react-input-mask'
import MsgError from 'src/components/MsgError'
import { Container } from './styles'

interface InputMaskProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  setValue?: (value: string) => void
  hasError?: boolean
  msgError?: string
  variation?: string
  value?: string
  disabled?: boolean
  onKeyUp?: () => void
  [x: string]: any
}

const InputMask: React.FC<InputMaskProps> = ({
  setValue,
  label,
  hasError,
  msgError,
  variation,
  value,
  disabled,
  children,
  ...rest
}) => {
  const [mask, setMask] = React.useState('(99) 99999-9999')
  return (
    <Container
      isHasValue={value?.trim() ? true : false}
      hasError={msgError || hasError}
      variation={variation}
    >
      {label && <label htmlFor={label}>{label}</label>}
      <ReactInputMask
        value={value}
        mask={mask}
        id={label}
        disabled={disabled}
        onChange={(event) => setValue && setValue(event.target.value)}
        onBlur={(e) => {
          if (e.target.value.replace('_', '').length === 14) {
            setMask('(99) 9999-9999')
          }
        }}
        onFocus={(e) => {
          if (e.target.value.replace('_', '').length === 14) {
            setMask('(99) 99999-9999')
          }
        }}
        data-test={`inputPhone-${label}`}
        {...rest}
      />
      {msgError && <MsgError>{msgError}</MsgError>}
    </Container>
  )
}

export default InputMask
