import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useHistory } from 'react-router-dom'
import { DASHBOARD } from 'src/layouts/typePath'

interface AlertDialogProps {
  title?: string
  contentText?: string
  open: boolean
  setOpen: (value: boolean) => void
}

const AlertDialog: React.FC<AlertDialogProps> = (props) => {
  const history = useHistory()

  const handleClose = () => {
    props.setOpen(false)
  }

  const handleConfirm = () => {
    props.setOpen(false)
    history.push(DASHBOARD)
  }

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {props.title && (
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      )}
      <DialogContent>
        {props.contentText && (
          <DialogContentText id="alert-dialog-description">
            {props.contentText}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Voltar
        </Button>
        <Button onClick={handleConfirm} variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AlertDialog
