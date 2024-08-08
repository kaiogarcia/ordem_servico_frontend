import styled from 'styled-components'

export const Container = styled.div`
  > form {
    > div:nth-child(2) {
      > button {
        height: 50px;
        position: relative;
        top: 21px;
      }
    }
  }
`
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
  > div:first-child {
    font-size: 24px;
    margin-bottom: 24px;
    font-weight: 800;
  }
`
