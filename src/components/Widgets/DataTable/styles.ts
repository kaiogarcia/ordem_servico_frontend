import { DataGrid } from '@mui/x-data-grid'
import styled, { css } from 'styled-components'

export const DataGridStyled = styled(DataGrid)<{ isShowCheckbox?: boolean }>`
  .MuiDataGrid-selectedRowCount {
    visibility: hidden;
  }
  ${({ isShowCheckbox }) =>
    !isShowCheckbox &&
    css`
      .MuiDataGrid-columnHeaderCheckbox {
        visibility: hidden;
      }
    `}
`
