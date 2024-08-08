import React, { InputHTMLAttributes, useEffect, useState } from 'react'
import { IMaskInput } from 'react-imask'
import ReactInputMask from 'react-input-mask'
import { useSelector } from 'react-redux'
import { AutocompleteOptions } from 'src/components/Form/Autocomplete'
import MsgError from 'src/components/MsgError'
import { formatInputPrice, formatPrice } from 'src/helpers/formatPrice'
import { IStore } from 'src/store/Types'
import { useTotalSum } from '../../../../hooks/useTotalSum'
import { Container } from './styles'

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  setValue?: (value: string) => void
  hasError?: boolean
  type?: string
  msgError?: string
  variation?: string
  mask?: string
  value?: string
  disabled?: boolean
  useIMask?: boolean
  onBlur?: () => void
  onKeyUp?: () => void
  price?: AutocompleteOptions
  setPrice?: (newState: AutocompleteOptions) => void
  [x: string]: any
}

const InputText: React.FC<InputTextProps> = ({
  // setValue,
  setPrice,
  label,
  hasError,
  msgError,
  variation,
  mask,
  // value,
  disabled,
  useIMask,
  children,
  price,
  ...rest
}) => {
  const [value, setValue] = useState('')

  const { sum } = useTotalSum()

  const services = useSelector(
    (state: IStore) =>
      state.service.services.filter(
        (service) => service._id === price?.value,
      )[0],
  )

  useEffect(() => {
    setValue(formatPrice(services?.value))
    if (services?.value) sum(Number(services?.value))
  }, [price])

  const onFormatterPrice = (value: string) => {
    const { formated, clean } = formatInputPrice(value)
    setValue(formated)
  }

  return (
    <Container
      hasError={msgError || hasError}
      variation={variation}
      isHasValue={value ? true : false}
    >
      {label && <label htmlFor={label}>{label}</label>}
      {useIMask ? (
        <IMaskInput
          id={label}
          value={value}
          mask={mask || ''}
          unmask={true}
          //disabled={disabled}
          onAccept={(value: any) => setValue && setValue(value)}
          {...rest}
        />
      ) : (
        <ReactInputMask
          value={value}
          mask={mask || ''}
          id={label}
          disabled={disabled}
          onChange={(event) => setValue && setValue(event.target.value)}
          data-test={`inputMask-${label}`}
          onKeyUp={() => onFormatterPrice(value)}
          {...rest}
        />
      )}
      {msgError && <MsgError>{msgError}</MsgError>}
    </Container>
  )
}

export default InputText
