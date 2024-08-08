import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges'
import SyncIcon from '@mui/icons-material/Sync'
import TaskIcon from '@mui/icons-material/Task'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { Tooltip } from '@mui/material'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import { GridCellParams, GridColDef } from '@mui/x-data-grid'
import { addDays, isBefore, parse } from 'date-fns'
import { useModal } from 'src/hooks/useModal'
import { usePermission } from 'src/hooks/usePermission'
import SendIcon from '@mui/icons-material/Send'
import {
  RECEITAS_EDITAR,
  RECEITAS_EXCLUIR,
} from 'src/views/modules/administration/permissions/static/keysPermissions'
import UploadDocument from 'src/views/modules/manager/seeAllServiceOrder/messages/UploadDocument'
import { AddPartialIncome } from '../../messages/AddPartialIncome'
import { DeleteConfirmation } from '../../messages/DeleteConfirmation'
import { EditIncome } from '../../messages/EditIncome'
import { UpdateConfirmation } from '../../messages/UpdateConfirmation'
import { Income } from '../adapter'
import { NofiticationMessage, NotificationText } from './style'
import { useAdmin } from 'src/services/useAdmin'
import { exceptionHandle } from 'src/helpers/exceptions'
import { toast } from 'src/components/Widgets/Toastify'

type ColumnsProps = {
  setMakeRequest: React.Dispatch<React.SetStateAction<number>>
}

export const useColumns = (props: ColumnsProps) => {
  const { showMessage } = useModal()
  const { hasPermission } = usePermission()
  const { apiAdmin } = useAdmin()

  const onHandleEdit = async (params: GridCellParams) => {
    if (params.field === 'group-buttons') {
      const data = params.row as Income
      showMessage(EditIncome, {
        data,
        setMakeRequest: props.setMakeRequest,
      })
    }
  }

  const onHandleDeleteRow = (params: GridCellParams) => {
    if (params.field === 'group-buttons') {
      const {
        clientName,
        id,
        osNumber,
        valueFormated,
        idFileCreatedGoogleDrive,
      } = params.row as Income
      showMessage(DeleteConfirmation, {
        osNumber,
        id,
        valueFormated,
        clientName,
        setMakeRequest: props.setMakeRequest,
        idFileCreatedGoogleDrive,
      })
    }
  }
  const onHandlePartialIncomes = (params: GridCellParams) => {
    if (params.field === 'group-buttons') {
      const { clientName, id, osNumber, valueFormated, description } =
        params.row as Income
      showMessage(AddPartialIncome, {
        id,
        osNumber,
        valueFormated,
        clientName,
        description,
        setMakeRequest: props.setMakeRequest,
      })
    }
  }

  const onHandleUpdateSituationRow = (params: GridCellParams) => {
    if (params.field === 'group-buttons') {
      const { clientName, id, valueFormated, situation, description } =
        params.row as Income
      showMessage(UpdateConfirmation, {
        valueFormated,
        clientName,
        id,
        situation,
        description,
        setMakeRequest: props.setMakeRequest,
      })
    }
  }

  const onUploadDocument = (params: GridCellParams) => {
    if (params.field === 'group-buttons') {
      const serviceOrder = params.row as Income
      showMessage(
        UploadDocument,
        { ...serviceOrder, setMakeRequest: props.setMakeRequest },
        true,
      )
    }
  }

  const onResendNotificationWhatsappToClient = async (
    params: GridCellParams,
  ) => {
    if (params.field === 'group-buttons') {
      const serviceOrder = params.row as Income
      try {
        await apiAdmin.post(`orderServices/sendNotificationWhatsappToClient`, {
          client: {
            phoneNumber: serviceOrder.clientPhoneNumber,
            id: serviceOrder.clientId,
          },
          osNumber: serviceOrder.osNumber,
          isSendFirstTime: false,
        })
        toast.success(
          `Aguarde que em breve iremos enviar a mensagem de notificação.`,
        )
      } catch (error) {
        exceptionHandle(error)
      }
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'clientName',
      headerName: 'Nome',
      width: 380,
      renderCell: (params: GridCellParams) => {
        const data = params.row as Income
        return (
          <>
            {!data?.isSendNotificationBoletoRecebido && (
              <NofiticationMessage>
                {!data?.isPartial && <div>{data.clientName}</div>}
                {data?.isPartial && (
                  <div>
                    <b>[PARCIAL]</b> {data.clientName}
                  </div>
                )}
                <section>
                  {(data.isSendNowDayMaturityBoleto ||
                    data.isSendThreeDayMaturityBoleto) &&
                    data.situation === 'PENDENTE' && (
                      <NotificationText>
                        Notificação de cobrança enviado
                      </NotificationText>
                    )}

                  {!data?.isBoletoUploaded &&
                    data.formOfPayment === 'Boleto' &&
                    data.situation === 'PENDENTE' &&
                    data?.description !== 'NOTINHA' && (
                      <NotificationText warning={!data?.isBoletoUploaded}>
                        Boleto não importado
                      </NotificationText>
                    )}

                  {data?.isBoletoUploaded &&
                    data?.description !== 'NOTINHA' && (
                      <NotificationText success>
                        Boleto Importado
                      </NotificationText>
                    )}

                  {data?.description && (
                    <div>
                      <b>{data?.valuePartial && '[PARCIAL] - '}</b>
                      {String(data.description).toUpperCase()}
                    </div>
                  )}
                </section>
              </NofiticationMessage>
            )}
            {data?.isSendNotificationBoletoRecebido && (
              <NofiticationMessage>
                <div>{data.clientName}</div>
                <NotificationText success>Notificação de boleto recebido enviado.</NotificationText>
              </NofiticationMessage>
            )}
          </>
        )
      },
    },
    { field: 'osNumber', headerName: 'Nº OS', width: 55 },
    {
      field: 'valueFormated',
      headerName: 'Valor',
    },
    {
      field: 'situation',
      headerName: 'Status',
      width: 125,
      renderCell: (params: GridCellParams) => {
        const situation = params.value as string
        return (
          <Chip
            label={situation === 'PAGO' ? 'RECEBIDO' : 'PENDENTE'}
            color={situation === 'PAGO' ? 'success' : 'warning'}
          />
        )
      },
    },
    {
      field: 'formOfPayment',
      headerName: 'Forma Pagamento',
      width: 130,
      renderCell: (params: GridCellParams) => {
        const { formOfPayment, maturityOfTheBoleto } = params.row as Income
        const today = new Date()
        const threeDaysFromNow = addDays(today, 3)
        const maturityDate = parse(
          maturityOfTheBoleto || '',
          'dd/MM/yyyy',
          new Date(),
        )
        if (formOfPayment === 'Boleto') {
          const isWithinIntervalMaturityDate = isBefore(
            maturityDate,
            threeDaysFromNow,
          )
          return (
            <div>
              <div>
                {formOfPayment}
                <span
                  style={{
                    color: isWithinIntervalMaturityDate ? 'red' : '',
                    fontWeight: isWithinIntervalMaturityDate ? '900' : '',
                  }}
                ></span>
              </div>
            </div>
          )
        } else {
          return <div>{formOfPayment}</div>
        }
      },
    },
    {
      field: 'maturityOfTheBoleto',
      headerName: 'Vencimento',
      width: 100,
      renderCell: (params: GridCellParams) => {
        const { maturityOfTheBoleto, situation } = params.row as Income
        const today = new Date()
        const threeDaysFromNow = addDays(today, 3)
        const maturityDate = parse(
          maturityOfTheBoleto || '',
          'dd/MM/yyyy',
          new Date(),
        )
        const isWithinIntervalMaturityDate = isBefore(
          maturityDate,
          threeDaysFromNow,
        )
        return (
          <span
            style={{
              color:
                situation === 'PENDENTE'
                  ? isWithinIntervalMaturityDate
                    ? 'red'
                    : ''
                  : '',
              fontWeight:
                situation === 'PENDENTE'
                  ? isWithinIntervalMaturityDate
                    ? '900'
                    : ''
                  : '',
            }}
          >
            {maturityOfTheBoleto}
          </span>
        )
      },
    },
    { field: 'dateOS', headerName: 'Entrada' },
    { field: 'dateClientPayment', headerName: 'Recebimento' },
    {
      field: 'group-buttons',
      headerName: ' ',
      sortable: false,
      disableColumnMenu: true,
      width: 210,
      renderCell: (params: GridCellParams) => (
        <>
          {params.row.situation === 'PAGO' && params.row.valuePartial && (
            <Tooltip
              title={
                params.row.situation === 'PENDENTE'
                  ? 'Atualizar para RECEBIDO'
                  : 'Atualizar paga PENDENTE'
              }
            >
              <IconButton
                aria-label="update"
                color="info"
                onClick={() => onHandleUpdateSituationRow(params)}
                disabled={!hasPermission(RECEITAS_EDITAR)}
              >
                {params.row.situation === 'PENDENTE' ? (
                  <PublishedWithChangesIcon />
                ) : (
                  <SyncIcon />
                )}
              </IconButton>
            </Tooltip>
          )}

          <>
            <Tooltip title={'Excluir'}>
              <IconButton
                aria-label="delete"
                color="error"
                onClick={() => onHandleDeleteRow(params)}
                disabled={!hasPermission(RECEITAS_EXCLUIR)}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </>

          {!params.row.valuePartial && (
            <Tooltip title={'Editar'}>
              <IconButton
                aria-label="editar"
                color="info"
                onClick={() => onHandleEdit(params)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}

          {params.row.situation === 'PENDENTE' &&
            params.row.description !== 'NOTINHA' && (
              <>
                <Tooltip title={'Adicionar Recebimento Parcial'}>
                  <IconButton
                    aria-label="parcial"
                    color="info"
                    onClick={() => onHandlePartialIncomes(params)}
                    disabled={!hasPermission(RECEITAS_EDITAR)}
                  >
                    <CurrencyExchangeIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          {params.row.typeDocument !== 'ORCAMENTO' &&
            params.row.situation === 'PENDENTE' &&
            params.row.formOfPayment === 'Boleto' &&
            params.row.description !== 'NOTINHA' && (
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
                  disabled={!hasPermission(RECEITAS_EDITAR)}
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
            params.row.situation === 'PENDENTE' &&
            params.row.formOfPayment === 'Boleto' &&
            params?.row?.isBoletoUploaded &&
            params.row.description !== 'NOTINHA' && (
              <Tooltip title={'Reenviar Notificação'}>
                <IconButton
                  color={params.row?.isBoletoUploaded ? 'info' : 'default'}
                  onClick={() => onResendNotificationWhatsappToClient(params)}
                  disabled={!hasPermission(RECEITAS_EDITAR)}
                >
                  <SendIcon />
                </IconButton>
              </Tooltip>
            )}
          {params.row.typeDocument !== 'ORCAMENTO' &&
            params.row.situation === 'PENDENTE' &&
            params.row.formOfPayment === 'Pix' && (
              <Tooltip title={'Enviar notificação de cobrança de pix'}>
                <IconButton
                  color={'secondary'}
                  onClick={() => onResendNotificationWhatsappToClient(params)}
                  disabled={!hasPermission(RECEITAS_EDITAR)}
                >
                  <SendIcon />
                </IconButton>
              </Tooltip>
            )}
        </>
      ),
    },
  ]
  return columns
}
