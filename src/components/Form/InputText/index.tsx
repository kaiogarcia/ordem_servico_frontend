import React, { InputHTMLAttributes } from 'react'
import { UseFormRegister } from 'react-hook-form'
import MsgError from 'src/components/MsgError'
import hasLetter from 'src/helpers/hasLetter'
import hasNumber from 'src/helpers/hasNumber'
import hasSpecialCaracter from 'src/helpers/hasSpecialCaracter'
import { Container } from './styles'

type InputProps = {
  register?: UseFormRegister<any>
  required?: boolean
}

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  name?: string
  setValue?: (value: string) => void
  value: string
  initValue?: string
  hasError?: boolean
  type?: string
  msgError?: string
  variation?: 'secondary'
  onlyLetter?: boolean
  onlyNumber?: boolean
  noSpecialCaracter?: boolean
  [x: string]: any
}

const InputText: React.FC<InputTextProps & InputProps> = ({
  label = '',
  name,
  register,
  setValue,
  value,
  hasError = false,
  type = 'text',
  msgError = '',
  variation = '',
  onlyLetter = false,
  onlyNumber = false,
  noSpecialCaracter,
  required,
  initValue,
  ...rest
}) => {
  const [inputTextValue, setInputTextValue] = React.useState(initValue)
  const [isToLoadInitial, setIsToLoadInitial] = React.useState(true)

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (!setValue) return
    if (
      (onlyLetter && hasNumber(target.value)) ||
      (onlyLetter && hasSpecialCaracter(target.value))
    ) {
      return
    }
    if (
      (onlyNumber && hasSpecialCaracter(target.value)) ||
      (onlyNumber && hasLetter(target.value))
    ) {
      return
    }

    if (noSpecialCaracter && hasSpecialCaracter(target.value)) {
      return
    }

    setInputTextValue(target.value)
    setValue(target.value)
  }

  React.useEffect(() => {
    if (isToLoadInitial) {
      setValue(initValue || '')
    }

    if (initValue) {
      setIsToLoadInitial(false)
    }
  }, [initValue])

  return (
    <Container
      variation={variation}
      hasError={msgError || hasError}
      isHasValue={value?.trim() ? true : false}
    >
      {label && <label htmlFor={label}>{label}</label>}
      <input
        type={type}
        id={label}
        onChange={handleChange}
        data-test={`inputText-${label}`}
        {...rest}
      />
      {msgError && <MsgError>{msgError}</MsgError>}
    </Container>
  )
}

export default InputText
