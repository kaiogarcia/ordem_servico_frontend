import React from 'react'
import { Container } from './style'
const MsgError = ({ children, ...rest }) => {
  return <Container {...rest}>{children}</Container>
}

export default MsgError
