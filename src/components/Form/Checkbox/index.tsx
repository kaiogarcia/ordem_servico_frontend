import React from 'react'
import { Container } from './styles'
import { Checkbox as MaterialCheckbox, FormControlLabel } from '@mui/material'

interface CheckboxProps {
  checked: boolean
  setValue?: React.Dispatch<React.SetStateAction<boolean>>
  label: string | JSX.Element
  hasError?: boolean
  messageError?: string
  colorLight?: boolean
  disabled?: boolean
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  setValue,
  label,
  hasError = false,
  messageError = '',
  colorLight = false,
  disabled = false,
  ...rest
}) => {
  return (
    <Container hasError={hasError} checked={checked} colorLight={colorLight}>
      <FormControlLabel
        control={
          <MaterialCheckbox
            checked={checked}
            onChange={setValue && (() => setValue(!checked))}
            inputProps={{ 'aria-label': 'primary checkbox' }}
            disabled={disabled}
            color="primary"
            {...rest}
          />
        }
        label={label}
        data-test={`checkbox-${label}`}
      />
      {messageError && <small>{messageError}</small>}
    </Container>
  )
}
