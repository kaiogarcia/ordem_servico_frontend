import { AxiosError } from 'axios'
import { toast } from 'src/components/Widgets/Toastify'

/**
 * @description
 * Sometimes the object is Arraybuffer if the data is equal to Image.
 * Then, I created this function to check out if data is ArrayBuffer or not and
 * return a message for the user.
 * @param {ArrayBuffer} arrayBufferObject [ArrayBuffer]
 * @returns {boolean} [boolean]
 */
const checkObjectIsArraybuffer = (arrayBufferObject: ArrayBuffer): boolean => {
  if (arrayBufferObject instanceof ArrayBuffer) {
    const enc = new TextDecoder('utf-8')
    const { message } = JSON.parse(enc.decode(arrayBufferObject))
    toast.error(message)
    return true
  } else {
    return false
  }
}

/**
 * @param {AxiosError} error [AxiosError]
 * @param {string} messageStatusError500 [string]
 */
export const exceptionHandle = (
  error: AxiosError,
  messageStatusError500?: string,
): void => {
  console.log(error)
  const message =
    messageStatusError500 ||
    'Ops! Houve um erro, atualize a página e tente novamente, se o problema persistir entre em contato com o suporte técnico.'

  if (error) {
    const { response } = error
    if (response?.status !== 500) {
      if (checkObjectIsArraybuffer(response?.data)) return
      const dataMessage = response?.data.message
      if (Array.isArray(dataMessage)) {
        response.data.message.forEach((message: string) => {
          toast.error(message)
        })
      } else {
        toast.error(dataMessage)
      }
    } else {
      toast.error(message)
    }
  } else {
    toast.error(message)
  }
}
