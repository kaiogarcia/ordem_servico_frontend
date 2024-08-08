import styled, { css } from 'styled-components'

import colors from 'src/styles/colors'

import arrowDownIcon from 'src/assets/icons/arrow-down-select.svg'

interface ContainerProps {
  hasError?: string | boolean
  variation?: string
  [x: string]: any
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
  transition: all 0.3s;

  > label {
    margin-bottom: 6px;
    color: #909090;
    font-size: 14px;
    line-height: 16px;
    font-weight: 400;
  }

  .form-select:focus {
    box-shadow: unset;
  }

  > select {
    color: ${colors.gray.dark};
    border-radius: 8px;
    padding: 14px 16px;
    padding-right: 40px;
    position: relative;
    border: 1px solid ${colors.gray.light};
    box-shadow: 0px 2px 4px 0px #e5e5e5;
    font-weight: 500;
    outline: none;
    width: 100%;
    line-height: 1.25;

    appearance: none;
    background: ${colors.white};
    background-image: url(${arrowDownIcon});
    background-size: 10px;
    background-repeat: no-repeat;
    background-position-x: calc(100% - 16px);
    background-position-y: 50%;
    font-size: 14px;

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
      border: 1px solid #dcdfe6;
    }

    :focus {
      border: 1px solid;
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

    ${({ variation, theme }) =>
      variation === 'secondary' &&
      css<ContainerProps>`
        border: none;
        border-bottom: 2px solid
          ${({ hasError, theme }) =>
            hasError ? colors.orange.light : theme.medium};
        border-radius: 0;
        box-shadow: none;
        background-color: transparent;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 5px;

        :focus,
        ::after {
          border: none;
          border-bottom: 2px solid ${theme.main};
          border-color: ${({ hasError, theme }) =>
            hasError ? colors.orange.light : theme.main};
        }
      `}
  }

  ${({ variation }) =>
    variation === 'highlight' &&
    css`
      background: linear-gradient(
        88.69deg,
        #4d22aa 3.78%,
        #7437da 48.21%,
        #823eee 95.7%
      );
      border-radius: 8px;

      > select {
        background-color: transparent;
        box-shadow: none;
        border: none;
        color: #fff;

        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 16px;

        :focus,
        ::after {
          border: none;
        }
      }
    `}

  > small {
    margin-top: 6px;

    font-weight: 500;
    font-size: 12px;
    line-height: 20px;

    color: ${colors.orange.middleDark};
  }
`
