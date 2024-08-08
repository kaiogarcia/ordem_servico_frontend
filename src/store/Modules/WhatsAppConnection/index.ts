import { WHATSAPP_CONNECTION } from 'src/store/actions'
import { Action } from './type'

export const initialState = {
  sessionState: '',
  session: '',
  userNumber: '',
  defaultNumber: false,
  lastUpdate: '',
  nameUserSession: '',
}

const whatsappConnectionReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case WHATSAPP_CONNECTION: {
      const {
        defaultNumber,
        lastUpdate,
        sessionState,
        session,
        userNumber,
        nameUserSession,
      } = action.payload
      return {
        ...state,
        defaultNumber,
        lastUpdate,
        sessionState,
        session,
        userNumber,
        nameUserSession,
      }
    }
    default: {
      return { ...state }
    }
  }
}

export default whatsappConnectionReducer
