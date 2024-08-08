import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Modal } from './components'
import SimpleBackdrop from './components/Backdrop'
import { BASENAME } from './config/constant'
import { LoadingProvider } from './hooks/useLoading'
import { ModalProvider } from './hooks/useModal'
import routes, { renderRoutes } from './routes'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'

/** Configuração das cores do Theme global do sistema */
const themeSystem = createTheme({
  palette: {
    primary: {
      // main: '#00223E',
      main: '#3f4d67',
    },
    // secondary: {
    //   main: '#C00000',
    // },
    error: {
      main: '#C00000',
    },
  },
})

const App = () => {
  setInterval(() => {
    document.querySelector('iframe')?.remove()
  }, 1000)

  const setZoom = () => {
    const zoomLevel = 0.9 // Defina o nível de zoom desejado (90% = 0.9)
    document.body.style.zoom = zoomLevel
  }

  useEffect(() => {
    setZoom()
    // Para atualizar o zoom se a janela do navegador for redimensionada
    window.addEventListener('resize', setZoom)

    return () => {
      // Remova o ouvinte do evento quando o componente for desmontado
      window.removeEventListener('resize', setZoom)
    }
  }, [])

  return (
    <React.Fragment>
      <ThemeProvider theme={themeSystem}>
        <ModalProvider>
          <LoadingProvider>
            <Router basename={BASENAME}>{renderRoutes(routes)}</Router>
            <ToastContainer />
            <SimpleBackdrop />
            <Modal />
          </LoadingProvider>
        </ModalProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default App
