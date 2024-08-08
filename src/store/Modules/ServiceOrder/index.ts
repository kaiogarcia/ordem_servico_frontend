import { SERVICE_ORDER_FILTER, SERVICE_ORDER_SEE_ALL } from 'src/store/actions'
import { Action } from './type'

export const INIT_STATE = {
  serviceOrders: [
    {
      _id: '',
      status: '',
      osNumber: '',
      dateOS: '',
      equipament: '',
      brand: '',
      model: '',
      serialNumber: '',
      cable: '',
      charger: '',
      breaked: '',
      detail: '',
      client: {
        name: '',
        address: '',
        city: '',
        uf: '',
        cpfOrCnpj: '',
        email: '',
        phoneNumber: '',
        phoneNumberFixo: '',
        cep: '',
      },
      itemServices: [],
      laudos: [],
      itemPieces: [],
      total: '',
      manpower: '',
    },
  ],
  serviceOrderFilter: {
    clientName: undefined,
    osNumber: undefined,
  },
}

export default function serviceOrderReducer(
  state = INIT_STATE,
  action: Action,
) {
  switch (action.type) {
    case SERVICE_ORDER_SEE_ALL: {
      return {
        ...state,
        serviceOrders: action.payload,
      }
    }
    case SERVICE_ORDER_FILTER: {
      return {
        ...state,
        serviceOrderFilter: action.payload,
      }
    }
    default: {
      return { ...state }
    }
  }
}
