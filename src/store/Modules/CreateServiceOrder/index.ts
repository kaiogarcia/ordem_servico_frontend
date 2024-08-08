import { SERVICE_ORDER_CREATE } from 'src/store/actions'
import { Action } from './type'

export const INIT_STATE_CREATE_SERVICE_ORDER = {
  createServiceOrder: {
    laudos: [
      {
        checked: false,
        description: '',
        service: '',
      },
    ],
    total: 0,
  },
}

export default function createServiceOrderReducer(
  state = INIT_STATE_CREATE_SERVICE_ORDER,
  action: Action,
) {
  switch (action.type) {
    case SERVICE_ORDER_CREATE: {
      return {
        ...state,
        createServiceOrder: action.payload,
      }
    }
    default: {
      return { ...state }
    }
  }
}
