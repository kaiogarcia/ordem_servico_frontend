import { FormControlLabel } from '@mui/material'
import styled, { css } from 'styled-components'

export const ContainerUploadDocuments = styled.section`
  margin-left: 15px;
`
export const ContainerDocuments = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

export const Container = styled.section<{ isUseWidth?: boolean }>`
  //padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  ${({ isUseWidth }) =>
    isUseWidth &&
    css`
      width: 750px;
    `}
`
export const ButtonGroup = styled.section`
  display: flex;
  gap: 10px;
  justify-content: center;
`
// export const Text = styled.section<{ bold?: boolean }>`
//   font-size: 20px;
//   align-self: center;
//   ${({ bold }) =>
//     bold &&
//     css`
//       font-weight: bold;
//     `}
//   > svg {
//     width: 80px;
//     height: 80px;
//   }
// `

export const Text = styled.section<{
  bold?: boolean
  alignSelf?: string
  fontSize?: string
  flexDirection?: string
}>`
  align-self: ${({ alignSelf }) => alignSelf};
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection};
  font-size: ${({ fontSize }) => fontSize};
  > span {
    margin-left: 3px;
    margin-right: 3px;
    font-weight: 900;
  }
  > div {
    font-weight: 800;
    > span {
      font-weight: 300;
    }
  }
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

export const UpdateDeleteConfirmationContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
`

export const NewExpenseContainer = styled.div`
  > div:first-child {
    font-size: 19px;
    > b {
      margin-left: 5px;
    }
  }
`
export const DeleteConfirmationContainer = styled.div`
  > div:first-child {
    font-size: 19px;
    > b {
      margin-left: 5px;
    }
  }
`

export const TitleModalNewExpense = styled.div`
  font-size: 24px;
  margin-bottom: 24px;
  font-weight: 800;
`
