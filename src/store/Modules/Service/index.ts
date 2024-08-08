import { SERVICE_FILTER, SERVICE_SEE_ALL } from 'src/store/actions'
import { Action } from './type'

export const INIT_STATE = {
  services: [
    {
      _id: '',
      description: '',
      laudos: '',
      value: '',
    },
  ],
  serviceFilter: {
    description: undefined,
    value: undefined,
  },
}

export default function serviceReducer(state = INIT_STATE, action: Action) {
  switch (action.type) {
    case SERVICE_SEE_ALL: {
      return {
        ...state,
        services: action.payload,
      }
    }
    case SERVICE_FILTER: {
      return {
        ...state,
        serviceFilter: action.payload,
      }
    }
    default: {
      return { ...state }
    }
  }
}
