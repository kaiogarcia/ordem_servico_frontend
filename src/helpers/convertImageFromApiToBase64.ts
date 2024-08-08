import { AxiosResponse } from 'axios'

export const convertImageFromApiToBase64 = (
  responseApi: AxiosResponse,
): string => {
  let binary = ''
  const bytes = new Uint8Array(responseApi.data)

  const length = bytes.byteLength

  for (let i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  const source = `data:${
    responseApi.headers['content-type']
  };base64,${window.btoa(binary)}`

  return source
}
