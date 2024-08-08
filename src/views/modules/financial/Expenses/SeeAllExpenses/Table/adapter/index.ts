import { format, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatInputPrice } from 'src/helpers/formatPrice'
import { PieceT } from 'src/store/Types'

export type Response = {
  expense: string
  value?: string
  dateIn: string
  maturity: string
  status: string
  month: string
  year: string
  user: string
  _id: string
  expense_type: string
}

export type Expense = {
  expense: string
  value?: number
  dateIn: string
  maturity: string
  status: string
  valueFormated: string
  isRegister?: PieceT
  month: string
  year: string
  user: string
  id: string
  expense_type?: string
}

type ResponseFromApi = {
  resultFromApi: Expense[]
  orderedMonth: string[]
  orderedYear: string[]
  monthAndYear: MonthAndYear[]
}

export type MonthAndYear = {
  month: string
  year: string
}

export const fromApi = (
  expense: Response[],
  pieces: PieceT[],
): ResponseFromApi => {
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

  const resultFromApi = expense.map((item) => ({
    expense: item.expense,
    value: removeFormatValueOs(item.value),
    dateIn: item.dateIn,
    maturity: item.maturity,
    status: item.status,
    situation: item.status,
    month: getMonthAndYear(item.dateIn).month,
    year: getMonthAndYear(item.dateIn).year,
    valueFormated: item.value,
    user: item.user || '',
    isRegister: pieces.find(
      (piece) =>
        piece.description?.toUpperCase().trim() ===
        item.expense?.toUpperCase().trim(),
    ),
    id: item._id,
    expense_type: item?.expense_type,
  }))

  const orderedYear = (resultFromApi: Expense[]): string[] => {
    const yearSet = new Set<string>(resultFromApi.map((item) => item.year))
    return Array.from(yearSet).sort()
  }

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

  const orderedMonth = Array.from(monthSet).sort((a, b) => {
    return orderMonth.indexOf(a) - orderMonth.indexOf(b)
  })

  const monthAndYear = Array.from(monthAndYearSet).map((str) => {
    const [month, year] = str.split('-');
    return { month, year };
  });

  return {
    resultFromApi,
    orderedMonth,
    orderedYear: orderedYear(resultFromApi),
    monthAndYear: sortMonths(monthAndYear),
  }
}
