import React, { InputHTMLAttributes } from 'react'
import MsgError from 'src/components/MsgError'
import CpfCnpj from './CpfCnpj'
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
  fieldState: { error },
  ...rest
}) => {
  const [mask, setMask] = React.useState('99.999.999/9999-99')
  return (
    <Container
      hasError={msgError || hasError}
      variation={variation}
      isHasValue={value?.trim() ? true : false}
    >
      {label && <label htmlFor={label}>{label}</label>}
      <CpfCnpj
        value={value}
        id={label}
        onChange={(event) => setValue && setValue(event.target.value)}
        {...rest}
      />
      {(msgError || error) && <MsgError>{msgError || error.message}</MsgError>}
    </Container>
  )
}

export default InputMask
