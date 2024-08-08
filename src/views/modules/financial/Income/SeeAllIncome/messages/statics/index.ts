import { AutocompleteOptions } from 'src/components/Form/Autocomplete'

const { addDays, format, isValid, parse } = require('date-fns')

export const statusOptions = [
  { label: 'RECEBIDO', value: 'RECEBIDO' },
  {
    label: 'PENDENTE',
    value: 'PENDENTE',
  },
]

export const addDaysMaturity = (dateString: string): AutocompleteOptions[] => {
  const date = parse(dateString, 'dd/MM/yyyy', new Date())
  if (!isValid(date)) {
    return [] as AutocompleteOptions[]
  }
  const datePlus15Days = addDays(date, 15)
  const datePlus30Days = addDays(date, 30)
  const result = [
    format(datePlus15Days, 'dd/MM/yyyy'),
    format(datePlus30Days, 'dd/MM/yyyy'),
  ]
  return [
    { label: result[0], value: result[0] },
    { label: result[1], value: result[1] },
  ]
}
