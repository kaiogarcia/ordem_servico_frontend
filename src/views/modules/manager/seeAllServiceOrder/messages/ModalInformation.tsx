import * as React from 'react'
import Box from '@mui/material/Box'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import LinearProgress from '@mui/material/LinearProgress'

type DialogModal = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  open: boolean
  maxWidth?: DialogProps['maxWidth']
  fullWidth?: boolean
  text?: string
}

export const ModalInformation: React.FC<DialogModal> = ({
  setOpen,
  open = false,
  maxWidth = 'xl',
  fullWidth = true,
  text
}) => {
  // const handleClickOpen = () => {
  //   setOpen(true)
  // }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        sx={{
          zIndex: 999999999999999
        }}
      // onClose={handleClose}
      >
        {/* <DialogTitle>Optional sizes</DialogTitle> */}
        <DialogContent>
          {/* <DialogContentText>
            You can set my maximum width and whether to adapt or not.
          </DialogContentText> */}
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
            {text}
            <LinearProgress />
          </Box>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions> */}
      </Dialog>
    </React.Fragment>
  )
}
