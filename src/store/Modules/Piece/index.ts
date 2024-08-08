import { PIECE_FILTER, PIECE_SEE_ALL } from 'src/store/actions'
import { Action } from './type'

export const INIT_STATE = {
  pieces: [
    {
      _id: '',
      description: '',
      value: '',
    },
  ],
  pieceFilter: {
    description: undefined,
    value: undefined,
  },
}

export default function pieceReducer(state = INIT_STATE, action: Action) {
  switch (action.type) {
    case PIECE_SEE_ALL: {
      return {
        ...state,
        pieces: action.payload,
      }
    }
    case PIECE_FILTER: {
      return {
        ...state,
        pieceFilter: action.payload,
      }
    }
    default: {
      return { ...state }
    }
  }
}
