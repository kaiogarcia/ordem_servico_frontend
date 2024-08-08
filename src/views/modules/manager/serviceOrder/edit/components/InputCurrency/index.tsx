import React, { InputHTMLAttributes, useEffect } from 'react'
import { IMaskInput } from 'react-imask'
import ReactInputMask from 'react-input-mask'
import { useSelector } from 'react-redux'
import { AutocompleteOptions } from 'src/components/Form/Autocomplete'
import MsgError from 'src/components/MsgError'
import { formatInputPrice, formatPrice } from 'src/helpers/formatPrice'
import hasNumber from 'src/helpers/hasNumber'
import { IStore } from 'src/store/Types'
import { Container } from './styles'

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  setValue?: (value: string) => void
  value?: string
  hasError?: boolean
  type?: string
  msgError?: string
  variation?: string
  mask?: string
  disabled?: boolean
  useIMask?: boolean
  onBlur?: () => void
  onKeyUp?: () => void
  price?: AutocompleteOptions
  setPrice?: (newState: AutocompleteOptions) => void
  isCurrencyNumberOnly?: boolean
  isPercent?: boolean
  width?: string
  [x: string]: any
}

const InputText: React.FC<InputTextProps> = ({
  setValue,
  setPrice,
  label,
  hasError,
  msgError,
  variation,
  mask,
  value,
  disabled,
  useIMask,
  children,
  price,
  isCurrencyNumberOnly = false,
  width,
  isPercent = false,
  ...rest
}) => {
  // const [value, setValue] = useState('')

  const services = useSelector(
    (state: IStore) =>
      state.service.services.filter(
        (service) => service._id === price?.value,
      )[0],
  )

  useEffect(() => {
    if (isPercent) {
      setValue(`${value}%`)
    } else {
      if (setValue) setValue(formatPrice(value))
    }
  }, [])

  const onFormatterPrice = (value: string) => {
    const { formated } = formatInputPrice(value)
    setValue(formated)
    if (isCurrencyNumberOnly) {
      if (hasNumber(value)) {
        setValue(value)
      } else {
        setValue(value)
      }
    } else {
      const { formated } = formatInputPrice(value)
      setValue(formated)
    }
  }

  return (
    <Container
      hasError={msgError || hasError}
      variation={variation}
      isHasValue={value ? true : false}
      width={width}
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
