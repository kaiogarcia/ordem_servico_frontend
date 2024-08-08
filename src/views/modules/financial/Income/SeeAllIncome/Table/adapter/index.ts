import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatInputPrice } from 'src/helpers/formatPrice'
import { OSData } from 'src/views/modules/manager/serviceOrder/create/type'

export type Income = {
  clientName: string
  clientPhoneNumber?: string
  clientId: string
  cpfOrCnpj: string
  osNumber: string
  valueNumber: number
  valueFormated: string
  formOfPayment: string
  situation: string
  dateOS: string
  month: string
  year: string
  idFileCreatedGoogleDrive?: string
  maturityOfTheBoleto?: string
  isSendNowDayMaturityBoleto?: boolean
  isSendThreeDayMaturityBoleto?: boolean
  isSendNotificationBoletoRecebido?: boolean
  isBoletoUploaded?: boolean
  isPartial?: boolean
  isLaunchMoney?: boolean
  description?: string
  valuePartial?: string
  dateClientPayment?: string
  id: string
}

type ResponseFromApi = {
  resultFromApi: Income[]
  orderedMonth: string[]
  orderedYear: string[]
  monthAndYear: MonthAndYear[]
}

export type MonthAndYear = {
  month: string
  year: string
}

export const fromApi = (oSData: OSData[]): ResponseFromApi => {
  const monthSet = new Set<string>()
  const monthAndYearSet = new Set<string>()
  const orderMonth = [
    'JAN',
    'FEV',
    'MAR',
    'ABR',
    'MAI',
    'JUN',
    'JUL',
    'AGO',
    'SET',
    'OUT',
    'NOV',
    'DEZ',
  ]

  const removeFormatValueOs = (total: string): number => {
    const { clean } = formatInputPrice(total)
    return clean
  }

  const getMonthAndYear = (dateString: string): MonthAndYear => {
    const dateParse = parse(dateString, 'dd/MM/yyyy', new Date())
    const month = format(dateParse, 'MMM', { locale: ptBR }).toUpperCase()
    const year = format(dateParse, 'yyyy')
    monthSet.add(month)
    monthAndYearSet.add(`${month}-${year}`)
    return { month, year }
  }

  const resultFromApi = oSData.map((item) => ({
    clientName: item?.client?.name,
    clientPhoneNumber: item?.client?.phoneNumber,
    clientId: item?.client?.id,
    cpfOrCnpj: item?.client?.cpfOrCnpj,
    osNumber: item?.osNumber,
    valueNumber: removeFormatValueOs(item.total),
    valueFormated: item.total,
    situation: item.status,
    dateOS: item.dateOS,
    month: getMonthAndYear(item?.dateClientPayment || item.dateOS).month,
    year: getMonthAndYear(item?.dateClientPayment || item.dateOS).year,
    formOfPayment: item.formOfPayment,
    typeDocument: item?.typeDocument,
    idFileCreatedGoogleDrive: item?.idFileCreatedGoogleDrive,
    maturityOfTheBoleto: item?.maturityOfTheBoleto,
    id: item._id,
    isSendNowDayMaturityBoleto: item?.isSendNowDayMaturityBoleto,
    isSendThreeDayMaturityBoleto: item?.isSendThreeDayMaturityBoleto,
    isSendNotificationBoletoRecebido: item?.isSendNotificationBoletoRecebido,
    isBoletoUploaded: item?.isBoletoUploaded,
    isPartial: item?.isPartial,
    description: item?.description || '',
    valuePartial: item?.valuePartial,
    isLaunchMoney: item?.isLaunchMoney,
    dateClientPayment: item?.dateClientPayment,
  }))

  const orderedYear = (resultFromApi: Income[]): string[] => {
    const yearSet = new Set<string>(resultFromApi.map((item) => item.year))
    return Array.from(yearSet).sort()
  }

  const orderedMonth = Array.from(monthSet).sort((a, b) => {
    return orderMonth.indexOf(a) - orderMonth.indexOf(b)
  })

  const sortMonths = (months: MonthAndYear[]): MonthAndYear[] => {
    return months.sort((a, b) => {
      const monthIndexA = orderMonth.indexOf(a.month);
      const monthIndexB = orderMonth.indexOf(b.month);
      if (monthIndexA < monthIndexB) return -1;
      if (monthIndexA > monthIndexB) return 1;
      // Se os meses forem iguais, ordenar por ano
      return parseInt(a.year) - parseInt(b.year);
    });
  };

  const monthAndYear = Array.from(monthAndYearSet).map((str) => {
    const [month, year] = str.split('-');
    return { month, year };
  });

  return {
    resultFromApi: resultFromApi.filter(
      (item) => item.typeDocument !== 'ORCAMENTO',
    ),
    orderedMonth,
    orderedYear: orderedYear(resultFromApi),
    monthAndYear: sortMonths(monthAndYear)
  }
}
