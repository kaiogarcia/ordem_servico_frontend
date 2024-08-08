import io from 'socket.io-client'

export const socket = io(process.env.REACT_APP_ADMIN_API_HOST_PRODUTION || process.env.REACT_APP_ADMIN_API_HOST)
