// interface ColumnProps {
//   field: string
//   headerName: string
//   width?: number
//   id?: number | string
// }

// export const columns: ColumnProps[] = [
//   { field: 'name', headerName: 'Nome', width: 400 },
//   // { field: 'address', headerName: 'Endereço', width: 200 },
//   // { field: 'city', headerName: 'Cidade', width: 200 },
//   // { field: 'uf', headerName: 'UF', width: 200 },
//   { field: 'cpfOrCnpj', headerName: 'CPF/CNPJ', width: 90 },
//   { field: 'phoneNumber', headerName: 'Telefone', width: 90 },
// ]

import { GridCellParams, GridColDef } from '@mui/x-data-grid'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import { useModal } from 'src/hooks/useModal'
import RemoveConfirmation from '../../messages/RemoveConfirmation'
import { ClientT } from 'src/store/Types'
import { ADMINISTRATION_CLIENTS_EDIT } from 'src/layouts/typePath'
import { useHistory } from 'react-router-dom'
import { CLIENTES_EDITAR, CLIENTES_EXCLUIR } from '../../../permissions/static/keysPermissions'
import { usePermission } from 'src/hooks/usePermission'
import formatTextWithLimit from 'src/helpers/formatTextWithLimit'
import { NotificationText } from './style'
import { useAdmin } from 'src/services/useAdmin'
import { useEffect, useState } from 'react'

export const useColumns = () => {
  const { showMessage } = useModal()
  const history = useHistory()
  const { hasPermission } = usePermission()
  const { apiAdmin } = useAdmin()
  const [clientsWithoutEmail, setClientsWithoutEmail] = useState([])

  const getTotalClientWithoutEmail = async () => {
    try {
      const { data } = await apiAdmin.get('orderServices/total-client-without-email')
      setClientsWithoutEmail(data)
    } catch (error) {
      console.log(
        'Houve um erro ao tentar retornar o total de client sem e-mail de cobrança na plataforma.',
      )
    }
  }

  const onHandleDeleteRow = (params: GridCellParams) => {
    if (params.field === 'group-buttons') {
      const client = params.row as ClientT
      showMessage(RemoveConfirmation, client)
    }
  }

  const onHandleUpdateRow = (params: GridCellParams) => {
    if (params.field === 'group-buttons') {
      const client = params.row as ClientT
      history.push(ADMINISTRATION_CLIENTS_EDIT, client)
    }
  }

  useEffect(() => {
    getTotalClientWithoutEmail()
  }, [])

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Nome',
      width: 450,
      renderCell: (params: GridCellParams) => {
        const { name, id } = params.row as ClientT
        const isClientWithotEmail = clientsWithoutEmail.find((client) => client._id === id)
        return (
          <div>
            <div>
              {name}
            </div>
            {isClientWithotEmail && <NotificationText>{isClientWithotEmail ? 'E-mail obrigatório para envio de cobrança.' : ''}</NotificationText>}
          </div>
        )
      },
    },
    {
      field: 'address',
      headerName: 'Endereço',
      width: 400,
      renderCell: (params: GridCellParams) => {
        const { address, city, uf } = params.row as ClientT
        const addressClient = `${address} - ${city}/${uf}`
        return (
          <div>
            <div>
              {formatTextWithLimit(addressClient, 50)}
            </div>
          </div>
        )
      },
    },
    {
      field: 'phoneNumber',
      headerName: 'Telefone',
      width: 120,
      renderCell: (params: GridCellParams) => {
        const { phoneNumber, phoneNumberFixo } = params.row as ClientT
        return (
          <div>
            <div>{phoneNumber}</div>
            <div>{phoneNumberFixo}</div>
          </div>
        )
      },
    },
    {
      field: 'user',
      headerName: 'Alterado',
    },
    {
      field: 'group-buttons',
      headerName: '',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridCellParams) => (
        <>
          <IconButton
            aria-label="edit"
            color="primary"
            onClick={() => onHandleUpdateRow(params)}
            disabled={!hasPermission(CLIENTES_EDITAR)}
          >
            <EditIcon />
          </IconButton>
          <>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => onHandleDeleteRow(params)}
              disabled={!hasPermission(CLIENTES_EXCLUIR)}
            >
              <DeleteForeverIcon />
            </IconButton>
          </>
        </>
      ),
    },
  ]
  return columns
}
