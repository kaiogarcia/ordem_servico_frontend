import styled, { css } from 'styled-components'

interface NotificationTextProps {
  warning?: boolean
  success?: boolean
}

export const NofiticationMessage = styled.div`
  display: flex;
  flex-direction: column;
  > section {
    display: flex;
    gap: 10px;
  }
`

export const NotificationText = styled.div<NotificationTextProps>`
  background: #3f4d67;
  ${({ warning }) =>
    warning &&
    css`
      background: #ed6c02;
    `}
  ${({ success }) =>
    success &&
    css`
      background: #2e7d32;
    `}
  color: #fff;
  border-radius: 5px;
  padding: 2px;
  width: fit-content;
`
