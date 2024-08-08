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

export const Modal = styled.div`
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
    grid-template-columns: 1fr 1fr 1fr;
  }
`

export const ButtonContainer = styled.div`
  display: grid;
  gap: 95px;
  grid-template-columns: repeat(2, 1fr);
`

export const NewIncomeContainer = styled.div`
  width: 730px;
  > div:first-child {
    font-size: 19px;
    > b {
      margin-left: 5px;
    }
  }
`

export const TitleModalNewIncome = styled.div`
  font-size: 24px;
  margin-bottom: 24px;
  font-weight: 800;
`

export const UpdateDeleteConfirmationContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
`

export const UpdateConfirmationContainer = styled.div`
  > div:first-child {
    font-size: 19px;
    > b {
      margin-left: 5px;
    }
  }
`
