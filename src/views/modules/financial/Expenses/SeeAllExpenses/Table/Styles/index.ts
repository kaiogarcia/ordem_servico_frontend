import { LinearProgress } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import styled from 'styled-components'

export const IconButtonStyled = styled(IconButton)`
  position: relative;
  top: 10px;
`

export const LinearProgressStyled = styled(LinearProgress)`
  position: absolute;
  overflow: hidden;
  display: block;
  height: 4px;
  z-index: 0;
  background-color: rgb(167, 202, 237);
  width: 95%;
`

export const ButtonGenerateOSContainer = styled.div`
  padding: 10px 0px 10px 0px;
`
