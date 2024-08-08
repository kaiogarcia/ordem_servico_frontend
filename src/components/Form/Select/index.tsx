import * as React from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

interface SelectProps {
  options: OptionsProps[]
  setValue?: (value: string) => void
  label: string
  errorMessage?: string
  size?: sizeType
  variant?: variantType
  fullWidth?: boolean
}

export interface OptionsProps {
  label: string
  value: string
}

type variantType = 'outlined' | 'filled' | 'standard'
type sizeType = 'small' | 'medium'

const SelectTextFields: React.FC<SelectProps> = (props) => {
  const [valueOption, setValueOption] = React.useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props?.setValue(event.target.value)
    setValueOption(event.target.value)
  }

  return (
    <TextField
      select
      value={valueOption}
      label={props.label}
      onChange={handleChange}
      helperText={props.errorMessage}
      fullWidth={props.fullWidth}
      size={props.size}
    >
      {props.options?.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default SelectTextFields
