import { GridCellParams, GridColDef } from '@mui/x-data-grid'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import TaskIcon from '@mui/icons-material/Task'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import CachedIcon from '@mui/icons-material/Cached'
import PdfIcon from '@mui/icons-material/PictureAsPdf'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import { useModal } from 'src/hooks/useModal'
import RemoveConfirmation from '../../messages/RemoveConfirmation'
import { MappedDataServiceOrders } from '../../types'
import { useHistory } from 'react-router-dom'
import {
  MANAGER_SERVICE_ORDER_EDIT,
  MANAGER_SERVICE_ORDER_VIEW,
} from 'src/layouts/typePath'
// import { OSData } from '../../../serviceOrder/create/type'
import { useAdmin } from 'src/services/useAdmin'
import { useLoading } from 'src/hooks/useLoading'
import { toast } from 'src/components/Widgets/Toastify'
import Tooltip from '@mui/material/Tooltip'
import ConfirmationChangeTypeDocument from '../../messages/ConfirmationChangeTypeDocument'
import { usePermission } from 'src/hooks/usePermission'
import {
  ORDEM_SERVICO_EDITAR,
  ORDEM_SERVICO_EXCLUIR,
} from 'src/views/modules/administration/permissions/static/keysPermissions'
import { NotificationText } from './style'
import UploadDocument from '../../messages/UploadDocument'

export const useColumns = () => {
  const { showMessage } = useModal()
  const history = useHistory()
  const { apiAdmin } = useAdmin()
  const { Loading } = useLoading()
  const { hasPermission } = usePermission()

  const onHandleEdit = async (params: GridCellParams) => {
    if (params.field === 'group-buttons') {
      const dataDocument = params.row
      try {
        Loading.turnOn()
        const { data: oSData } = await apiAdmin.get(
          `orderServices/${dataDocument.id}`,
        )
        history.push(MANAGER_SERVICE_ORDER_EDIT, { oSData })
      } catch (error) {
        toast.error(
          'Opss! Houve um erro ao tentar abrir a edição da Ordem de Serviço.',
        )
      } finally {
        Loading.turnOff()
      }
    }
  }

  const onHandleDeleteRow = (params: GridCellParams) => {
    if (params.field === 'group-buttons') {
      const serviceOrder = params.row as MappedDataServiceOrders
      showMessage(RemoveConfirmation, serviceOrder)
    }
  }
  const onUploadDocument = (params: GridCellParams) => {
    if (params.field === 'group-buttons') {
      const serviceOrder = params.row as MappedDataServiceOrders
      showMessage(UploadDocument, serviceOrder, true)
    }
  }

  const onHandleConfirmationChangeTypeDocument = (params: GridCellParams) => {
    if (params.field === 'group-buttons') {
      const serviceOrder = params.row as MappedDataServiceOrders
      showMessage(ConfirmationChangeTypeDocument, serviceOrder)
    }
  }

  const onHandleGeneratePDF = async (params: GridCellParams) => {
    const dataIncomeTable = params.row
    try {
      Loading.turnOn()
      const { data: oSData } = await apiAdmin.get(
        `orderServices/${dataIncomeTable.id}`,
      )
      history.push(MANAGER_SERVICE_ORDER_VIEW, { oSData })
    } catch (error) {
      toast.error('Opss! Houve um erro ao tentar gerar a Ordem de Serviço.')
    } finally {
      Loading.turnOff()
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Nome',
      width: 230,
      renderCell: (params: GridCellParams) => {
        const data = params.row as MappedDataServiceOrders
        return (
          <div>
            {!data?.isPartial && <div>{data.name}</div>}
            {data?.isPartial && (
              <div>
                <b>[PARCIAL]</b>
                {data.name}
              </div>
            )}
            {/* {(data.isSendNowDayMaturityBoleto || data.isSendThreeDayMaturityBoleto) && <NotificationText>Notificação de cobrança enviado</NotificationText>} */}
          </div>
        )
      },
    },
    { field: 'osNumber', headerName: 'Nº OS', width: 60 },
    { field: 'dateOS', headerName: 'Data' },
    {
      field: 'total',
      headerName: 'Valor',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 125,
      renderCell: (params: GridCellParams) => {
        const situation = params.value as string
        return (
          <Chip
            label={situation}
            color={situation === 'PAGO' ? 'success' : 'warning'}
          />
        )
      },
    },
    {
      field: 'typeDocument',
      headerName: 'Tipo Documento',
      width: 185,
      renderCell: (params: GridCellParams) => {
        const typeDocument = params.value as string
        let type = ''
        if (typeDocument === 'ORCAMENTO') {
          type = 'ORÇAMENTO'
        } else {
          type = 'ORDEM DE SERVIÇO'
        }
        return (
          <Chip
            label={type}
            color={typeDocument === 'ORCAMENTO' ? 'primary' : 'secondary'}
          />
        )
      },
    },
    {
      field: 'dateGeneratedOS',
      headerName: 'Google Drive',
      width: 165,
      renderCell: (params: GridCellParams) => {
        const dateGeneratedOS = params.value as string
        if (dateGeneratedOS !== 'HOUVE UM ERRO') {
          return <div>{dateGeneratedOS}</div>
        } else {
          return (
            <Chip
              label={dateGeneratedOS}
              color={
                dateGeneratedOS === 'HOUVE UM ERRO' ? 'error' : 'secondary'
              }
            />
          )
        }
      },
    },
    {
      field: 'user',
      headerName: 'Alterado',
    },
    {
      field: 'group-buttons',
      headerName: ' ',
      sortable: false,
      disableColumnMenu: true,
      width: 200,
      renderCell: (params: GridCellParams) => (
        <>
          {!params.row.isPartial && (
            <Tooltip title="Visualizar PDF">
              <IconButton
                aria-label="PDF"
                color="info"
                onClick={() => onHandleGeneratePDF(params)}
              >
                <PdfIcon />
              </IconButton>
            </Tooltip>
          )}

          {!params.row.isPartial && (
            <Tooltip title="Excluir">
              <IconButton
                aria-label="excluir"
                color="error"
                onClick={() => onHandleDeleteRow(params)}
                disabled={!hasPermission(ORDEM_SERVICO_EXCLUIR)}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          )}
          {params.row.typeDocument === 'ORCAMENTO' && (
            <Tooltip
              title={`${
                params.row.typeDocument === 'ORCAMENTO'
                  ? 'Converter para ORDEM DE SERVIÇO'
                  : 'Converter para ORÇAMENTO'
              }`}
            >
              <IconButton
                aria-label="Mudar de tipo de documento"
                color="info"
                onClick={() => onHandleConfirmationChangeTypeDocument(params)}
                disabled={!hasPermission(ORDEM_SERVICO_EDITAR)}
              >
                <CachedIcon />
              </IconButton>
            </Tooltip>
          )}
          {params.row.typeDocument !== 'ORCAMENTO' &&
            params.row.status === 'PENDENTE' &&
            params.row.formOfPayment === 'Boleto' && (
              <Tooltip
                title={
                  params.row?.isBoletoUploaded
                    ? 'Boleto importado'
                    : 'Importar boleto'
                }
              >
                <IconButton
                  aria-label="Importar Boleto"
                  color={params.row?.isBoletoUploaded ? 'info' : 'default'}
                  onClick={() => onUploadDocument(params)}
                  disabled={!hasPermission(ORDEM_SERVICO_EXCLUIR)}
                >
                  {!params.row?.isBoletoUploaded ? (
                    <UploadFileIcon />
                  ) : (
                    <TaskIcon />
                  )}
                </IconButton>
              </Tooltip>
            )}
          {params.row.typeDocument !== 'ORCAMENTO' &&
            params.row.status === 'PENDENTE' &&
            params.row.formOfPayment === 'Pix' && (
              <Tooltip
                title={
                  params.row?.isBoletoUploaded
                    ? 'Documento importado'
                    : 'Importar Documentos'
                }
              >
                <IconButton
                  aria-label="Importar Documento"
                  color={params.row?.isBoletoUploaded ? 'info' : 'default'}
                  onClick={() => onUploadDocument(params)}
                  disabled={!hasPermission(ORDEM_SERVICO_EXCLUIR)}
                >
                  {!params.row?.isBoletoUploaded ? (
                    <UploadFileIcon />
                  ) : (
                    <TaskIcon />
                  )}
                </IconButton>
              </Tooltip>
            )}
          {params.row.status === 'PENDENTE' && (
            <>
              <Tooltip
                title={`${
                  params.row.typeDocument === 'ORCAMENTO'
                    ? 'Editar o ORÇAMENTO'
                    : 'Editar a ORDEM DE SERVIÇO'
                }`}
              >
                <IconButton
                  aria-label="editar"
                  color="info"
                  onClick={() => onHandleEdit(params)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </>
      ),
    },
  ]
  return columns
}
