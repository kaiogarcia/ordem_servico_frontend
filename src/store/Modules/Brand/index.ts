import { EQUIPAMENT_FILTER, EQUIPAMENT_SEE_ALL } from 'src/store/actions'
import { Action } from './type'

export const INIT_STATE = {
  equipaments: [
    {
      _id: '',
      equipamentName: '',
      brand: '',
      model: '',
      serialNumber: '',
    },
  ],
  equipamentFilter: {
    equipamentName: undefined,
    brand: undefined,
    model: undefined,
    serialNumber: undefined,
  },
}

export default function brandReducer(state = INIT_STATE, action: Action) {
  switch (action.type) {
    case EQUIPAMENT_SEE_ALL: {
      return {
        ...state,
        equipaments: action.payload,
      }
    }
    case EQUIPAMENT_FILTER: {
      return {
        ...state,
        equipamentFilter: action.payload,
      }
    }
    default: {
      return { ...state }
    }
  }
}
