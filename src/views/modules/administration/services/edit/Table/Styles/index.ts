import { LinearProgress, TableCell } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import styled from 'styled-components'

export const IconButtonStyled = styled(IconButton)`
  position: relative;
  //top: 10px;
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

export const TableCellStyle = styled(TableCell)`
  > div {
    padding-top: 16px;
  }
`

export const ActionsContent = styled.section`
  position: relative;
  right: 15px;
`
