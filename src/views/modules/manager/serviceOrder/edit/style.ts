import { InputText } from 'src/components'
import styled from 'styled-components'

export const Container = styled.div``
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;
  gap: 5px;
`
export const Form = styled.form`
  background: #fff;
  padding: 22px;
  border-radius: 15px;
`

export const InputTextOSNumberDisabled = styled(InputText)`
  input:disabled {
    background: #e8f0fe;
    box-shadow: unset;
    color: black;
    font-weight: bold;
  }
`

export const GroupDiscount = styled.div`
  display: grid;
  //grid-template-columns: 1fr 2fr;
`
export const Total = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
`
