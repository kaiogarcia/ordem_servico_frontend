import { AxiosResponse } from 'axios'
import { Client, ClientFromApi } from './type'

export const fromApi = async (
  response: AxiosResponse,
): Promise<Array<ClientFromApi>> => {
  const { data } = response
  return data?.map((client: Client) => {
    delete client.__v
    return client
  })
}
