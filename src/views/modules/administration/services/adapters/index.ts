import { AxiosResponse } from 'axios'
import { ClientFromApi } from './type'

export const fromApi = async (
  response: AxiosResponse,
): Promise<Array<ClientFromApi>> => {
  const { data } = response
  return data?.map((item) => {
    delete item.__v
    return item
  })
}
