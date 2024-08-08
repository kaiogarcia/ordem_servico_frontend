/* eslint-disable react-hooks/exhaustive-deps */
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import * as React from 'react'
import { useLoading } from '../../hooks/useLoading'

interface BackDropProps {
  isLoading: boolean
}

export default function SimpleBackdrop(props: BackDropProps) {
  const { Loading, isLoading } = useLoading()

  const handleClose = () => {
    Loading.turnOff()
  }

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
