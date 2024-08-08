import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React from 'react'
import { columns } from './Columns'
import { ActionsContent, IconButtonStyled, TableCellStyle } from './Styles'

type TableViewProps = {
  laudos: string[]
  setLaudos: (newState: string[]) => void
  setLaudo: (newState: string, indexSelected?: number) => void
  setIsEdit: (newState: boolean) => void
}

const TableView: React.FC<TableViewProps> = ({ laudos, setLaudos, setLaudo, setIsEdit }) => {
  const removeLaudo = (index: number) => {
    setLaudos(laudos.filter((_, _index) => _index !== index))
    setIsEdit(false)
  }

  const editLaudo = (data: string, indexSelected: number) => {
    setLaudo(data, indexSelected)
    setIsEdit(true)
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {!!laudos.length &&
              columns.map((column) => (
                <>
                  {column.field === 'description' ? (
                    <TableCell>{column.headerName}</TableCell>
                  ) : (
                    <TableCell>{column.headerName}</TableCell>
                  )}
                </>
              ))}
            {!!laudos.length && <TableCell style={{ marginLeft: '10px' }}>Ações</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {!!laudos.length &&
            laudos?.sort()?.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => {
                  return (
                    <TableCellStyle>
                      <div>
                        <ul>
                          <li>
                            <b>{String(row)}</b>
                          </li>
                        </ul>
                      </div>
                    </TableCellStyle>
                  )
                })}
                <TableCell>
                  <ActionsContent>
                    <IconButtonStyled onClick={() => editLaudo(row, index)}>
                      <EditIcon
                        color="primary"
                      />
                    </IconButtonStyled>
                    <IconButtonStyled onClick={() => removeLaudo(index)}>
                      <DeleteForeverIcon
                        color="error"
                      />
                    </IconButtonStyled>
                  </ActionsContent>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableView
