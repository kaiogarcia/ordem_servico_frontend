import { addWeeks } from 'date-fns'
import { AutocompleteOptions } from 'src/components/Form/Autocomplete'

const { addDays, format, isValid, parse } = require('date-fns')

export const statusOptions = [
  { label: 'PAGO', value: 'PAGO' },
  {
    label: 'A PAGAR',
    value: 'A PAGAR',
  },
]
export const expensesTypeOptions = [
  { label: 'Empresa', value: 'Empresa' },
  {
    label: 'Pessoal',
    value: 'Pessoal',
  },
]

export const addDaysMaturity = (dateString: string): AutocompleteOptions[] => {
  const date = parse(dateString, 'dd/MM/yyyy', new Date())
  if (!isValid(date)) {
    return [] as AutocompleteOptions[]
  }
  const datePlus15Days = addDays(date, 15)
  const datePlus30Days = addDays(date, 30)
  const datePlus1Week = addWeeks(date, 1)
  const result = [
    format(datePlus15Days, 'dd/MM/yyyy'),
    format(datePlus30Days, 'dd/MM/yyyy'),
    format(datePlus1Week, 'dd/MM/yyyy'),
  ]
  return [
    { label: `${result[2]} - 7 dias`, value: result[2] },
    { label: `${result[0]} - 15 dias`, value: result[0] },
    { label: `${result[1]} - 30 dias`, value: result[1] },
  ]
}
