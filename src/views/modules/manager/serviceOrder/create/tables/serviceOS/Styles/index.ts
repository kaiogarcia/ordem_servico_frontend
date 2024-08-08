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

export const Container = styled.div`
  > div:first-child {
    color: #909090;
    margin: 0px 0px 8px;
    font-weight: bold;
    font-size: 14px;
    text-transform: uppercase;
    margin-top: 10px;
  }
`

export const ContainerButtonServiceAdd = styled.div`
  display: flex;
  gap: 1px;
  > button {
    height: 23px;
  }
`
