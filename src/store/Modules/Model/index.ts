import { MODEL_FILTER, MODEL_SEE_ALL } from 'src/store/actions'
import { Action } from './type'

export const INIT_STATE = {
  models: [
    {
      _id: '',
      description: '',
    },
  ],
  modelFilter: {
    description: undefined,
  },
}

export default function modelReducer(state = INIT_STATE, action: Action) {
  switch (action.type) {
    case MODEL_SEE_ALL: {
      return {
        ...state,
        models: action.payload,
      }
    }
    case MODEL_FILTER: {
      return {
        ...state,
        modelFilter: action.payload,
      }
    }
    default: {
      return { ...state }
    }
  }
}
