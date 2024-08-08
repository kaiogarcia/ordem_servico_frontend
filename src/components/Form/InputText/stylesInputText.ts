import { TextField } from '@mui/material'
import styled, { css } from 'styled-components'

interface ContainerProps {
  isHasValue: boolean
}

export const TextFieldStyled = styled(TextField)<ContainerProps>`
  /* .css-md26zr-MuiInputBase-root-MuiOutlinedInput-root.Mui-focused
    .MuiOutlinedInput-notchedOutline {
    border-color: #eeeeee;
  } */

  /* .css-1sumxir-MuiFormLabel-root-MuiInputLabel-root.Mui-focused {
    color: #909090;
  } */

  /* .css-1sumxir-MuiFormLabel-root-MuiInputLabel-root {
    left: -10px;
    top: -14px;
    font-size: 19px;
  } */

  /* input:focus {
    border-color: #eeeeee;
  } */

  input {
    color: #6a6a6a;
    border-radius: 8px;
    padding: 14px 16px;
    display: inline-block;
    transition: all 0.3s;
    position: relative;
    border: 1px solid #eeeeee;
    box-shadow: 0px 2px 4px 0px #e5e5e5;
    font-weight: 500;
    width: 100%;
    font-size: 14px;
    background-color: #fff;

    ${({ isHasValue }) =>
      isHasValue &&
      css`
        background: #e8f0fe;
      `}

    :focus {
      background: #e8f0fe;
    }

    ::placeholder {
      color: #afafaf;
    }
    :disabled {
      background: #eeeeee;
      box-shadow: unset;
    }
  }
`
