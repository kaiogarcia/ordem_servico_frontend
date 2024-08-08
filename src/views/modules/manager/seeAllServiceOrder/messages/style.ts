import styled, { css } from 'styled-components'

export const Modal = styled.section`
  // width: 500px;
  //display: none;
`

export const ContainerUploadDocuments = styled.section`
  margin-left: 15px;
`
export const ContainerDocuments = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

export const Container = styled.section`
  //padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`
export const ButtonGroup = styled.section`
  display: flex;
  gap: 6px;
  justify-content: center;
`
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
