import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React from 'react'
import { columns } from './Columns'
import { IconButtonStyled, TableCellStyle } from './Styles'

type TableViewProps = {
  laudos: string[]
  setLaudos: (newState: string[]) => void
}

const TableView: React.FC<TableViewProps> = ({ laudos, setLaudos }) => {
  const removeLaudo = (index: number) => {
    setLaudos(laudos.filter((_, _index) => _index !== index))
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
            {!!laudos.length && <TableCell>Ações</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {!!laudos.length &&
            laudos?.map((row, index) => (
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
                  <IconButtonStyled>
                    <DeleteForeverIcon
                      color="error"
                      onClick={() => removeLaudo(index)}
                    />
                  </IconButtonStyled>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableView
