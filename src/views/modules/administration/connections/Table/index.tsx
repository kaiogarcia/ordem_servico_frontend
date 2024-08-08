import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import QrCodeIcon from '@mui/icons-material/QrCode'
import LoadingButton from '@mui/lab/LoadingButton'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'src/components'
import { WHATSAPP_CONNECTION } from 'src/store/actions'
import { IStore } from 'src/store/Types'
import { useLoading } from '../../../../../hooks/useLoading'
import { useModal } from '../../../../../hooks/useModal'
import { useAdmin } from '../../../../../services/useAdmin'
import apiWhatsApp from '../../../../../services/apiWhatsApp'
import { ThrowException } from '../../../../../services/Exceptions'
import { socket } from '../../../../../services/Socket'
import { fromApi } from '../Adapters'
import QrCodeModalContent from '../Messages/QrCodeModal'
import { ConnectionDataI, TableViewProps } from '../Types'
import { columns } from './Columns'
import { IconButtonStyled } from './Styles'
import { useAuth } from 'src/hooks/useAuth'

const TableView: React.FC<TableViewProps> = ({ setIsMessageError }) => {
  const [dataTable, setDataTable] = React.useState<ConnectionDataI[]>([])
  const { Loading } = useLoading()
  const [loadingButton, setLoadingButton] = React.useState(false)
  const { showMessage } = useModal()
  const { apiAdmin } = useAdmin()
  const [isButtonAuthenticated, setIsButtonAuthenticated] =
    React.useState(false)

  const dispatch = useDispatch()
  const store = useSelector((state: IStore) => state.whatsappConnection)
  const { user } = useAuth()

  const getConnections = async () => {
    try {
      Loading.turnOn()
      const { data } = await apiAdmin.get(`connection-whats-app`)
      setDataTable(fromApi(data))
    } catch (error) {
      ThrowException(error)
    } finally {
      Loading.turnOff()
    }
  }

  const onReadQRCode = async () => {
    try {
      // await apiAdmin.get(`connection-user-wa/${75562626187}`)
      setLoadingButton(true)
      await apiWhatsApp.post(`start`, {
        session: String(user.user.cpf),
        wh_status: process.env.REACT_APP_WH_STATUS,
        wh_message: process.env.REACT_APP_WH_MESSAGE,
        wh_qrcode: process.env.REACT_APP_WH_QRCODE,
        wh_connect: process.env.REACT_APP_WH_CONNECT,
      })
    } catch (error) {
      ThrowException(error)
    }
  }

  React.useEffect(() => {
    // socket.on(CONNECTION_WHATSAPP_SERVICE_CREATE, (data) => {
    //   if (data?.status === 'created') getConnections()
    // })
    getConnections()
  }, [])

  React.useEffect(() => {
    // socket.on(EVENTS_SERVICE_CONNECT, (data) => {
    //   console.log({ EVENTS_SERVICE_CONNECT: data })
    //   if (data?.status === 'waitingConnection') setLoadingButton(true)
    // })
    // socket.on(
    //   `${CONNECTION_SERVICE_GETCONNECTION_CLIENT_QR}-${user.user.cpf}`,
    //   (data) => {
    //     // if (data?.status === 'qrCodeGenerated') setLoadingButton(false)
    //     if (data?.qrCode) {
    //       setLoadingButton(false)
    //       showMessage(QrCodeModalContent, { qrCode: data?.qrCode }, true)
    //     }
    //   },
    // )

    // socket.on(
    //   `${CONNECTION_SERVICE_GETCONNECTION_CLIENT_READY}-${user.user.cpf}`,
    //   (data) => {
    //     if (data?.status === 'ready') {
    //       dispatch({
    //         type: WHATSAPP_CONNECTION,
    //         payload: {
    //           userNumber: data?.info.number,
    //           nameUserSession: '',
    //           sessionState: 'CONNECTED',
    //           session: data?.sessionState,
    //         },
    //       })
    //     }
    //     if (data?.status === 'desconnected') {
    //       dispatch({
    //         type: WHATSAPP_CONNECTION,
    //         payload: {
    //           userNumber: null,
    //           nameUserSession: '',
    //           sessionState: 'DESCONNECTED',
    //           session: data?.sessionState,
    //         },
    //       })
    //     }
    //   },
    // )

    // return () => {
    //   socket.off(EVENTS_SERVICE_CONNECT)
    // }
  }, [])

  // const disconnect = () => {
  //   socket.emit('cancelSincronizationWhatsApp', 'disconnected')
  // }

  React.useEffect(() => {
    if (store.sessionState === 'CONNECTED') {
      setIsButtonAuthenticated(true)
      setIsMessageError(false)
    } else {
      setIsButtonAuthenticated(false)
    }
  }, [store])

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell>{column.headerName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataTable?.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {columns.map((column) => {
                if (column.field === 'actions') {
                  return (
                    <>
                      <IconButtonStyled>
                        <EditIcon />
                      </IconButtonStyled>
                      <IconButtonStyled>
                        <DeleteForeverIcon />
                      </IconButtonStyled>
                    </>
                  )
                } else if (column.field === 'session') {
                  return (
                    <TableCell>
                      {!isButtonAuthenticated ? (
                        <LoadingButton
                          onClick={onReadQRCode}
                          startIcon={<QrCodeIcon />}
                          loadingPosition="start"
                          size="small"
                          loading={loadingButton}
                          variant="contained"
                        >
                          QR Code
                        </LoadingButton>
                      ) : (
                        <Button
                          variant="outlined"
                          textButton="Desconectar"
                          color="error"
                          size="small"
                        />
                      )}
                    </TableCell>
                  )
                } else {
                  return <TableCell>{row[column.field]}</TableCell>
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableView
