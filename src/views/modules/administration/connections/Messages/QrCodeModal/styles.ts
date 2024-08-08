import styled from 'styled-components'

export const Container = styled.div`
  width: 600px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  > svg {
    width: 300px;
    height: 300px;
  }

  > button {
    position: relative;
    top: 15px;
  }
`
