import { IWhatsappConnection } from 'src/store/Types'

export interface Action {
  type: string
  payload: IWhatsappConnection
}
