import { FormControlLabel } from '@mui/material'
import styled, { css } from 'styled-components'

export const Container = styled.section`
  //padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`
export const ButtonGroup = styled.section`
  display: flex;
  gap: 10px;
  justify-content: center;
`
export const Text = styled.section<{ bold?: boolean }>`
  font-size: 20px;
  align-self: center;
  ${({ bold }) =>
    bold &&
    css`
      font-weight: bold;
    `}
`

export const FormControlLabelStyled = styled(FormControlLabel)`
  width: 695px;
`

export const Modal = styled.div<{ isHasMaturity: boolean }>`
  width: 555px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  > div:first-child {
    font-size: 18px;
  }
  > section {
    display: grid;
    gap: 10px;
    grid-template-columns: ${({ isHasMaturity }) =>
      isHasMaturity ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'};
  }
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
`

export const ButtonLaunchFinancialConfirmationContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
`

export const LaunchFinancialConfirmationContainer = styled.div`
  > div:first-child {
    font-size: 19px;
  }
`
