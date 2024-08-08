import colors from 'src/styles/colors'
import styled, { css } from 'styled-components'

interface ContainerProps {
  variation: string
  hasError: boolean | string
  isHasValue: boolean
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .css-1z10yd4-MuiFormControl-root-MuiTextField-root {
    margin-top: 22px;
    margin-bottom: 0px;
  }

  > div:first-child {
    margin-top: 20px;
  }

  label {
    /* margin-bottom: 6px;
    color: #909090;
    font-size: 14px;
    line-height: 16px;
    font-weight: 400; */

    left: -10px;
    top: -14px;
    font-size: 19px;
  }

  .form-select:focus {
    box-shadow: unset;
  }

  > input {
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

    /* ${({ isHasValue }) =>
      isHasValue &&
      css`
        background: #e8f0fe;
      `} */

    ::placeholder {
      color: #afafaf;
    }
    :disabled {
      background: #eeeeee;
      box-shadow: unset;
    }

    ::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      /* border: 1px solid #dcdfe6; */
    }

    :focus {
      border: 1px solid #419eff;
      border-color: ${({ hasError }) =>
        hasError ? colors.orange.light : '#419eff'};

      ::after {
        border: 1px solid #419eff;
        border-color: ${({ hasError }) =>
          hasError ? colors.orange.light : '#419eff'};
      }
    }

    ${({ hasError }) =>
      hasError &&
      css`
        border-color: ${colors.orange.light};
      `}

    ${({ variation, hasError, theme }) =>
      variation === 'secondary' &&
      css`
        border: none;
        padding: 5px;
        border-bottom: 2px solid
          ${hasError ? colors.orange.light : theme.medium};
        border-radius: 0;
        box-shadow: none;
        background-color: transparent;
        :focus,
        ::after {
          border: none;
          border-bottom: 2px solid ${theme.main};
          border-color: ${hasError ? colors.orange.light : theme.main};
        }
      `}
  }
`
