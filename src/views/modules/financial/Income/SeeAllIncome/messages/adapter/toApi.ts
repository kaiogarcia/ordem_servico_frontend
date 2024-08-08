import { SeeAllIncomeProps } from '../../types'

export const toApi = (data: SeeAllIncomeProps) => {
  return {
    status: data?.status,
    description: String(data?.income).toUpperCase(),
    total: data?.valueFormated,
    dateOS: data?.dateIn,
    formOfPayment: data?.paymentForm,
    maturityOfTheBoleto: data?.maturity,
    isLaunchMoney: data?.isLaunchMoney,
    dateClientPayment: data?.dateClientPayment,
  }
}
