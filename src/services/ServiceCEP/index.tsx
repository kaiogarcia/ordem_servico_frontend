import axios from 'axios'
import { toast } from 'src/components/Widgets/Toastify'
import { useLoading } from 'src/hooks/useLoading'
import { ServiceCEP } from './type'

/**
 * @description
 * EX: https://cdn.apicep.com/file/apicep/74395-200.json
 */
export const useServiceCEP = () => {
  const { Loading } = useLoading()
  const getAddressByCEP = async (cep: string): Promise<ServiceCEP> => {
    try {
      Loading.turnOn()
      const { data } = await axios.get<ServiceCEP>(
        `https://cdn.apicep.com/file/apicep/${cep}.json`,
      )
      return data
    } catch (error) {
      toast.warning('CEP não encontrado! Tente novamente.')
      return { ok: false }
    } finally {
      Loading.turnOff()
    }
  }
  return { getAddressByCEP }
}
