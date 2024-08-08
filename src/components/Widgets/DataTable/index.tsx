import * as React from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { DataGridStyled } from './styles'
interface TypeGenericRowWithId {
  id: string
}

type DataTableProps<TypeGenericRow> = {
  rows: TypeGenericRow[] & TypeGenericRowWithId[]
  columns: GridColDef[]
  pageSize?: number
  checkboxSelection?: boolean
  setCellClick?: (cellClick: TypeGenericRow[]) => void
  setSelectedAllRowIds?: (allRow: string[]) => void
  isShowCheckbox?: boolean
}

export const DataTable = <TypeGenericRow extends object>({
  columns,
  rows,
  pageSize = 10,
  checkboxSelection = false,
  isShowCheckbox = false,
  setCellClick,
  setSelectedAllRowIds,
}: DataTableProps<TypeGenericRow>) => {
  const customLocaleText = {
    noRowsLabel: 'Nenhum registro encontrado',
  }

  const handleSelectionModelChange = (ids: string[]) => {
    if (ids.length === 0 || ids.length === 1) {
      if (setSelectedAllRowIds) {
        setSelectedAllRowIds(ids)
      }
    } else {
      if (setSelectedAllRowIds) {
        setSelectedAllRowIds(ids)
      }
    }
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridStyled
        isShowCheckbox={isShowCheckbox}
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[10]}
        checkboxSelection={checkboxSelection}
        // @ts-ignore
        onSelectionModelChange={(ids) => handleSelectionModelChange(ids)}
        autoHeight
        disableSelectionOnClick
        onCellClick={(e) => {
          if (!e.value) {
            if (setCellClick)
              // @ts-ignore
              setCellClick((previousState: TypeGenericRowWithId[]) => [
                ...previousState.filter((item) => item.id !== e.row.id),
                e.row,
              ])
          } else {
            if (setCellClick) {
              // @ts-ignore
              setCellClick((previousState: TypeGenericRowWithId[]) => {
                const resultFilter = previousState.filter(
                  (item) => item.id !== e.row.id,
                )
                return [...resultFilter]
              })
            }
          }
        }}
        localeText={customLocaleText}
      />
    </div>
  )
}
