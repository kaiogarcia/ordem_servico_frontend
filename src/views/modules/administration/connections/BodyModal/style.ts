import styled from 'styled-components'

interface RowProps {
  marginTop?: string
  justifyContent?: string
  gap?: string
}

export const Row = styled.div<RowProps>`
  display: flex;
  gap: ${(props) => props.gap || '24px'};
  margin-top: ${(props) => props.marginTop};
  justify-content: ${(props) => props.justifyContent};
`
export const Form = styled.form`
  width: 600px;
`
