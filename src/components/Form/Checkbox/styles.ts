import styled, { css } from 'styled-components'

import colors from 'src/styles/colors'

interface ContainerProps {
  hasError?: boolean
  checked: boolean
  colorLight?: boolean
}

export const Container = styled.div<ContainerProps>`
  span + span {
    font-size: 16px;
    line-height: 20px;
    color: ${({ colorLight }) =>
      colorLight ? colors.gray.middleLight : colors.gray.middle};

    ${({ checked }) =>
      checked &&
      css`
        color: ${({ theme }) => theme.main};
      `}
  }

  > small {
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;

    color: ${colors.orange.middleDark};
    display: block;
    margin-left: 32px;
  }

  .MuiCheckbox-colorPrimary.Mui-checked {
    color: ${({ theme }) => theme.main};
  }

  .MuiCheckbox-colorPrimary.Mui-disabled {
    color: ${colors.gray.middle};
  }

  .MuiTypography-body1 {
    // font-family: Athletics;
  }
  .MuiTypography-body1.Mui-disabled {
    color: ${colors.gray.middle};
  }

  ${({ hasError }) =>
    hasError &&
    css`
      .MuiSvgIcon-root {
        fill: #df644b;
      }
    `}
`
