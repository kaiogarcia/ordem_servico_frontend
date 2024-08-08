interface ColumnProps {
    field: string;
    headerName: string;
    width?: number;
    id?: number | string;
}

export const columns: ColumnProps[] = [
    { field: 'connectionName', headerName: 'Nome conexão', width: 400 },
    { field: 'status', headerName: 'Status', width: 200 },
    { field: 'session', headerName: 'Sessão', width: 200 },
    { field: 'lastUpdate', headerName: 'Ultima atualização', width: 200 },
    { field: 'default', headerName: 'Padrão', width: 90 },
    { field: 'actions', headerName: 'Ações', width: 90 }
];
