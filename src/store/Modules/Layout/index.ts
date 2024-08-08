import {
  LAYOUT_IS_MODIFIED_FIELDS,
  LAYOUT_MAKE_REQUEST,
  LAYOUT_TITLE_PAGE,
} from 'src/store/actions'
import { Action } from './type'

export const INIT_STATE = {
  title: '',
  makeRequest: 0,
  fields: {},
  url: '',
}

const LayoutReducer = (state = INIT_STATE, action: Action) => {
  switch (action.type) {
    case LAYOUT_TITLE_PAGE: {
      return {
        ...state,
        title: action.payload.title,
      }
    }
    case LAYOUT_MAKE_REQUEST: {
      return {
        ...state,
        makeRequest: action.payload.makeRequest,
      }
    }
    case LAYOUT_IS_MODIFIED_FIELDS: {
      return {
        ...state,
        fields: action.payload.fields,
        url: action.payload.url,
      }
    }
    default: {
      return {
        ...state,
      }
    }
  }
}

export default LayoutReducer
