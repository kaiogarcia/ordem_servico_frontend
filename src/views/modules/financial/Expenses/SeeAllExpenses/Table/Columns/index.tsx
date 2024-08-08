import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges'
import SyncIcon from '@mui/icons-material/Sync'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { GridCellParams, GridColDef } from '@mui/x-data-grid'
import { isBefore, parse } from 'date-fns'
import { useModal } from 'src/hooks/useModal'
import { usePermission } from 'src/hooks/usePermission'
import { DESPESAS_EDITAR, DESPESAS_EXCLUIR } from 'src/views/modules/administration/permissions/static/keysPermissions'
import { DeleteConfirmation } from '../../messages/DeleteConfirmation'
import { UpdateConfirmation } from '../../messages/UpdateConfirmation'
import { UpdateConfirmationExpenseEmpresaPessoal } from '../../messages/UpdateConfirmationExpenseEmpresaPessoal'
import { Expense } from '../adapter'

type ColumnsProps = {
  setMakeRequest: React.Dispatch<React.SetStateAction<number>>
}

export const useColumns = (props: ColumnsProps) => {
  const { showMessage } = useModal()
  const { hasPermission } = usePermission()

  const onHandleDeleteRow = (params: GridCellParams) => {
    if (params.field === 'group-buttons') {
      const { id, valueFormated, expense, status } = params.row as Expense
      showMessage(DeleteConfirmation, {
        id,
        valueFormated,
        expense,
        status,
        setMakeRequest: props.setMakeRequest,
      })
    }
  }

  const onHandleUpdateSituationRow = (params: GridCellParams) => {
    if (params.field === 'group-buttons') {
      const { id, valueFormated, status, expense } = params.row as Expense
      showMessage(UpdateConfirmation, {
        valueFormated,
        id,
        situation: status,
        expense,
        setMakeRequest: props.setMakeRequest,
      })
    }
  }

  const onHandleUpdateSituationRowEmpresaOrPessoal = (params: GridCellParams) => {
    if (params.field === 'group-buttons') {
      const { id, expense_type, valueFormated, expense } = params.row as Expense
      showMessage(UpdateConfirmationExpenseEmpresaPessoal, {
        id,
        expense_type,
        valueFormated,
        expense,
        setMakeRequest: props.setMakeRequest,
      })
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'expense',
      headerName: 'Despesa',
      width: 380,
      renderCell: (params: GridCellParams) => {
        const data = params.row as Expense
        return (
          <Tooltip title={data.expense}>
            <div>
              <div>{data.expense}</div>
              <div style={data.expense_type === 'Pessoal' ? { fontWeight: 900 } : { fontWeight: 300 }}>{data.expense_type}</div>
            </div>
          </Tooltip>
        )
      },
    },
    {
      field: 'valueFormated',
      headerName: 'Valor',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params: GridCellParams) => {
        const situation = params.value as string
        return (
          <Chip
            label={situation === 'PAGO' ? 'PAGO' : 'A PAGAR'}
            color={situation === 'PAGO' ? 'success' : 'warning'}
          />
        )
      },
    },
    {
      field: 'isRegister',
      headerName: 'Peças',
      width: 160,
      renderCell: (params: GridCellParams) => {
        const isRegister = params.value as boolean
        return (
          <Chip
            label={isRegister ? 'REGISTRADO' : 'NÃO REGISTRADO'}
            color={isRegister ? 'primary' : 'secondary'}
          />
        )
      },
    },
    { field: 'dateIn', headerName: 'Entrada' },
    {
      field: 'maturity', headerName: 'Vencimento', width: 165,
      renderCell: (params: GridCellParams) => {
        const maturity = params.value as string
        const row = params.row
        const today = new Date()
        const maturityDate = parse(
          maturity || '',
          'dd/MM/yyyy',
          new Date(),
        )
        if (isBefore(maturityDate, today)) {
          if (row.situation?.toUpperCase().trim() === 'A PAGAR') {
            return (
              <Chip
                label={maturity}
                color={'error'}
              />
            )
          } else {
            return (
              <Chip
                label={maturity}
                color={'default'}
              />
            )
          }
        } else {
          return (
            <Chip
              label={maturity || 'NÃO INFORMADO'}
              color={'default'}
            />
          )
        }
      },
    },
    {
      field: 'user',
      headerName: 'Alterado',
      renderCell: (params: GridCellParams) => {
        const user = params.value as string
        return (
          <div style={user === 'NUBANK' ? { fontWeight: 900 } : { fontWeight: 100 }}>{user}</div>
        )
      },
    },
    {
      field: 'group-buttons',
      headerName: ' ',
      sortable: false,
      disableColumnMenu: true,
      width: 120,
      renderCell: (params: GridCellParams) => (
        <>
          <IconButton
            aria-label="update"
            color="primary"
            onClick={() => onHandleUpdateSituationRow(params)}
            disabled={!hasPermission(DESPESAS_EDITAR)}
          >
            {params.row.situation?.toUpperCase().trim() === 'A PAGAR' ? (
              <PublishedWithChangesIcon />
            ) : (
              <SyncIcon />
            )}
          </IconButton>
          <>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => onHandleDeleteRow(params)}
              disabled={!hasPermission(DESPESAS_EXCLUIR)}
            >
              <DeleteForeverIcon />
            </IconButton>
          </>
          <>
            {<Tooltip title={params.row.expense_type === 'Pessoal' ? 'Atualizar para Despesa da Empresa' : 'Atualizar paga Despesa Pessoal'}>
              <IconButton
                aria-label="update"
                color="secondary"
                onClick={() => onHandleUpdateSituationRowEmpresaOrPessoal(params)}
              >
                {params.row.expense_type === 'Pessoal' ? (
                  <CurrencyExchangeIcon />
                ) : (
                  <CurrencyExchangeIcon />
                )}
              </IconButton>
            </Tooltip>}
          </>
        </>
      ),
    },
  ]
  return columns
}
