import { combineReducers } from '@reduxjs/toolkit'
import { reducer as formReducer } from 'redux-form'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import layoutReducer from 'src/store/Modules/Layout'
import accountReducer from './accountReducer'
import equipamentReducer from './Modules/Brand'
import clientReducer from './Modules/Client'
import createServiceOrderReducer from './Modules/CreateServiceOrder'
// import modelReducer from './Modules/Model' Don't use it
import pieceReducer from './Modules/Piece'
import serviceReducer from './Modules/Service'
import serviceOrderReducer from './Modules/ServiceOrder'
import whatsappConnectionReducer from './Modules/WhatsAppConnection'

const settingPersistReducer = ({ key }) => {
  return {
    key,
    storage,
    keyPrefix: 'datta-',
  }
}

const reducers = combineReducers({
  account: persistReducer(
    settingPersistReducer({ key: 'account' }),
    accountReducer,
  ),

  form: formReducer,

  whatsappConnection: persistReducer(
    settingPersistReducer({ key: 'whatsappConnection' }),
    whatsappConnectionReducer,
  ),

  client: persistReducer(
    settingPersistReducer({ key: 'client' }),
    clientReducer,
  ),

  piece: persistReducer(settingPersistReducer({ key: 'piece' }), pieceReducer),

  service: persistReducer(
    settingPersistReducer({ key: 'service' }),
    serviceReducer,
  ),
  //model: persistReducer(settingPersistReducer({ key: 'model' }), modelReducer),

  equipament: persistReducer(
    settingPersistReducer({ key: 'equipament' }),
    equipamentReducer,
  ),

  serviceOrder: persistReducer(
    settingPersistReducer({ key: 'serviceOrder' }),
    serviceOrderReducer,
  ),

  createServiceOrder: persistReducer(
    settingPersistReducer({ key: 'createServiceOrder' }),
    createServiceOrderReducer,
  ),

  layout: persistReducer(
    settingPersistReducer({ key: 'layout' }),
    layoutReducer,
  ),
})

export default reducers
