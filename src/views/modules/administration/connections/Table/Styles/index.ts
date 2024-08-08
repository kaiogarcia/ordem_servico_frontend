import { LinearProgress, TableCell } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import styled from 'styled-components'

export const TableCellStyled = styled(TableCell)`
  .css-dsuxgy-MuiTableCell-root {
    position: relative;
    bottom: 9px;
  }
`
export const TableCellColumnStyled = styled(TableCell)`
  padding-left: 35px;
  min-width: 130px;
  max-width: 130px;
`

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
