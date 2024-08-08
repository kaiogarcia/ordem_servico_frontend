import colors from 'src/styles/colors'
import styled, { css } from 'styled-components'

interface ContainerProps {
  variation?: string
  hasError?: boolean | string
  isHasValue?: boolean
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  label {
    margin-bottom: 6px;
    color: ${colors.gray.middle};
    font-size: 14px;
    line-height: 16px;
    font-weight: 400;
  }

  > input {
    font-size: 14px;
    color: ${colors.gray.dark};
    border-radius: 8px;
    padding: 14px 16px;
    transition: all 0.3s;
    border: 1px solid ${colors.gray.light};
    box-shadow: 0px 2px 4px 0px #e5e5e5;
    font-weight: 500;
    width: 100%;

    ${({ isHasValue }) =>
      isHasValue &&
      css`
        background: #e8f0fe;
      `}

    ::placeholder {
      color: #afafaf;
    }

    :disabled {
      background: #eeeeee;
      box-shadow: unset;
    }

    ${({ hasError }) =>
      hasError &&
      css`
        border-color: ${colors.orange.light};
      `}
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
    }
  }
  ${({ variation, hasError, theme }) =>
    variation === 'secondary' &&
    css`
      > input {
        border: none;
        border-bottom: 2px solid
          ${() => (hasError ? colors.orange.light : theme.medium)};
        border-radius: 0;
        box-shadow: none;
        background-color: transparent;

        :focus,
        ::after {
          border: none;
          border-bottom: 2px solid ${theme.main};
          border-color: ${() => (hasError ? colors.orange.light : theme.main)};
        }
        padding: 5px;

        ::placeholder {
          color: ${colors.gray.middleLight};
        }
      }
    `}
`
