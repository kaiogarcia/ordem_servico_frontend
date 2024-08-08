import MsgError from 'src/components/MsgError'
import React, { SelectHTMLAttributes } from 'react'
// import MsgError from '../../MsgError'
import { Container } from './styles'

export interface SelectOption {
  value: string | number
  label: string | number
  disabled?: boolean
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[]
  label?: string
  setValue?: (value: any) => void
  // value: string | number | boolean
  labelDefaultOption?: string
  msgError?: string
  variation?: 'secondary' | 'highlight'
  hasError?: string | boolean
  // onChange?: (props: ChangeEvent<HTMLInputElement>) => void | undefined
  disabled?: boolean
  onBlur?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const Select: React.FC<SelectProps> = ({
  options = [],
  label,
  setValue,
  value = '',
  labelDefaultOption,
  msgError,
  variation,
  hasError,
  ...rest
}) => {
  return (
    <Container hasError={hasError} variation={variation} {...rest}>
      {label && <label htmlFor={label}>{label}</label>}
      <select
        onChange={({ target }) => {
          setValue && setValue(target.value)
        }}
        value={value}
        id={label}
        data-test={`select-${label}`}
        {...rest}
      >
        {labelDefaultOption && (
          <option value="" disabled>
            {labelDefaultOption}
          </option>
        )}
        {!!options?.length &&
          options?.map((option, index) => (
            <option
              value={option?.value}
              key={index}
              disabled={option?.disabled}
            >
              {option?.label}
            </option>
          ))}
      </select>
      {msgError && <MsgError>{msgError}</MsgError>}
    </Container>
  )
}
