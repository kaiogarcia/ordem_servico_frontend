import { CLIENT_FILTER, CLIENT_SEE_ALL } from 'src/store/actions'
import { Action } from './type'

export const INIT_STATE = {
  clients: [
    {
      _id: '',
      name: '',
      cpfOrCnpj: '',
      email: '',
      phoneNumber: '',
      phoneNumberFixo: '',
      address: '',
      city: '',
      uf: '',
      cep: '',
    },
  ],
  clientFilter: {
    name: undefined,
    cpfOrCnpj: undefined,
    phoneNumber: undefined,
    phoneNumberFixo: undefined,
    address: undefined,
    city: undefined,
    uf: undefined,
  },
}

export default function clientReducer(state = INIT_STATE, action: Action) {
  switch (action.type) {
    case CLIENT_SEE_ALL: {
      return {
        ...state,
        clients: action.payload,
      }
    }
    case CLIENT_FILTER: {
      return {
        ...state,
        clientFilter: action.payload,
      }
    }
    default: {
      return { ...state }
    }
  }
}
