import React from 'react'
import { Container } from './styles'
import { TextFieldStyled } from './stylesInputText'

interface InputTextProps {
  label?: string
  field: any
  toUpperCase?: boolean
  variant?: variantType
  capitalizeWords?: boolean
  [x: string]: any
  // setValue?: (value: string) => void
  // hasError?: boolean
  // msgError?: string
  // onlyLetter?: boolean
  // onlyNumber?: boolean
  // multiline?: boolean
  // rows?: number
  // noSpecialCaracter?: boolean
  // size?: sizeType
  // fullWidth?: boolean
  // name?: string
  // onChange: any
}

type variantType = 'outlined' | 'filled' | 'standard'
type sizeType = 'small' | 'medium'

const InputText: React.FC<InputTextProps> = ({
  label = '',
  field: { onChange, value },
  fieldState: { error },
  variant,
  toUpperCase = true,
  capitalizeWords = false,
  // setValue,
  // onChange,
  // hasError = false,
  // msgError = '',
  // onlyLetter = false,
  // onlyNumber = false,
  // noSpecialCaracter,
  // multiline,
  // rows,
  // fullWidth,
  // size,
  // name,
  ...rest
}) => {

  const transformValue = (input: string) => {
    if (toUpperCase) {
      input = input.toUpperCase()
    }

    if (capitalizeWords) {
      const words = input.split(' ')
      const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1))
      input = capitalizedWords.join(' ')
    }

    return input
  }

  const transformedValue = transformValue(value)


  return (
    <Container
      variation={'variation'}
      hasError={'msgError || hasError'}
      isHasValue={value?.trim() ? true : false}
    >
      <TextFieldStyled
        label={label}
        variant={variant || 'outlined'}
        margin="dense"
        isHasValue={value?.trim()}
        value={transformedValue}
        fullWidth
        onChange={onChange}
        error={!!error?.message}
        helperText={error ? error.message : null}
        focused
        inputProps={{
          style: {
            borderColor: "#eeeeee",
          },
        }}
        {...rest}
      />
    </Container>
  )
}

export default InputText
