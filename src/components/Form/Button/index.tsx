import AddIcon from '@mui/icons-material/Add'
import AddTaskIcon from '@mui/icons-material/AddTask'
import CloseIcon from '@mui/icons-material/Close'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import PdfIcon from '@mui/icons-material/PictureAsPdf'
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import BackIcon from '@mui/icons-material/Reply'
import SyncIcon from '@mui/icons-material/Sync'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { green } from '@mui/material/colors'
import React from 'react'

interface buttonProps {
  textButton: string
  variant: variantType
  color?: colorType
  disabled?: boolean
  icon?: iconType
  size?: sizeType
  onClick?: () => void
  type?: string
  loading?: boolean
  [x: string]: any
}

type variantType = 'outlined' | 'contained' | 'text'
type colorType =
  | 'inherit'
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'
type sizeType = 'small' | 'medium' | 'large'
type iconType =
  | 'add'
  | 'add2'
  | 'add3'
  | 'edit'
  | 'delete'
  | 'whatsApp'
  | 'back'
  | 'close'
  | 'pdf'
  | 'doc'
  | 'update'
  | 'update2'
  | 'upload'

const icons = {
  add: <AddIcon />,
  add2: <LibraryAddIcon />,
  add3: <AddTaskIcon />,
  edit: <EditIcon />,
  delete: <DeleteForeverIcon />,
  whatsApp: <WhatsAppIcon />,
  back: <BackIcon />,
  close: <CloseIcon />,
  pdf: <PdfIcon />,
  doc: <ReceiptLongIcon />,
  update: <SyncIcon />,
  update2: <PublishedWithChangesIcon />,
  upload: <UploadFileIcon />
}

const defineIcon = (icon: iconType) => {
  return icons[icon]
}

const _Button: React.FunctionComponent<buttonProps> = (props, { ...rest }) => {
  return (
    <React.Fragment>
      <Box sx={{ position: 'relative' }}>
        <Button
          variant={props.variant}
          color={props.color}
          disabled={props.disabled || false || props.loading}
          onClick={props.onClick}
          startIcon={defineIcon(props.icon)}
          size={props.size}
          type={props.type}
          style={{ width: '100%' }}
          {...rest}
        >
          {props.textButton}
        </Button>
        {props.loading && (
          <CircularProgress
            size={24}
            sx={{
              color: green[500],
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
    </React.Fragment>
  )
}

export default _Button
