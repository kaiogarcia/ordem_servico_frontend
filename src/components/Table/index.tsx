import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { GridColDef } from '@mui/x-data-grid';
import * as React from 'react';

/**
 * <thead>
                                <tr>
                                    <th>Nome conexão</th>
                                    <th>Status</th>
                                    <th>Sessão</th>
                                    <th>Ultima atualização</th>
                                    <th>Padrão</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Atendimento</td>
                                    <td>Bom</td>
                                    <td>Desconectar</td>
                                    <td>27/08/2022 18:20</td>
                                    <td>Ok</td>
                                    <td>Ações</td>
                                </tr>
                            </tbody>
 */

interface TableViewProps {
    checkboxSelection?: boolean;
    disableSelectionOnClick?: boolean;
    pageSize?: number;
    rowsPerPageOptions?: number[];
    height?: number;
    width?: string;
    disableColumnMenu?: boolean;
    columns: GridColDef[];
    data: any[];
}

// const columns: GridColDef[] = [
//     { field: 'id', headerName: 'ID', width: 90 },
//     {
//         field: 'firstName',
//         headerName: 'First name',
//         width: 150,
//         editable: true
//     },
//     {
//         field: 'lastName',
//         headerName: 'Last name',
//         width: 150,
//         editable: true
//     },
//     {
//         field: 'age',
//         headerName: 'Age',
//         type: 'number',
//         width: 110,
//         editable: true
//     },
//     {
//         field: 'fullName',
//         headerName: 'Full name',
//         description: 'This column has a value getter and is not sortable.',
//         sortable: false,
//         width: 160,
//         valueGetter: (params: GridValueGetterParams) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
//     }
// ];

const TableView: React.FC<TableViewProps> = (props) => {
    return (
        // <Box
        //     sx={{
        //         height: props.height || 400,
        //         width: props.width || '100%'
        //     }}
        // >
        //     <DataGrid
        //         rows={props.data}
        //         columns={props.columns}
        //         pageSize={props.pageSize || 5}
        //         rowsPerPageOptions={props.rowsPerPageOptions || [5]}
        //         checkboxSelection={props.checkboxSelection}
        //         disableColumnMenu={props.disableColumnMenu}
        //         autoHeight
        //         hideFooterSelectedRowCount={props.checkboxSelection}
        //         disableSelectionOnClick={props.disableSelectionOnClick}
        //         experimentalFeatures={{ newEditingApi: true }}
        //     />
        // </Box>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {props.columns.map((column) => (
                            <TableCell>{column.headerName}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.data?.map((row) => (
                        <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            {props.columns.map((column) => {
                                if (column.field === 'actions') {
                                    return (
                                        <IconButton>
                                            <SettingsIcon />
                                        </IconButton>
                                    );
                                } else {
                                    return <TableCell>{row[column.field]}</TableCell>;
                                }
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableView;
