import { parse, isBefore, isValid } from 'date-fns'

export const validateDate = (dateString: string): string => {
  const currentDate = new Date()
  const inputDate = parse(dateString, 'dd/MM/yyyy', new Date())

  if (isBefore(inputDate, currentDate)) {
    return 'Não é possível informar uma data de vencimento menor que a data atual.'
  }

  if (!isValid(inputDate)) {
    return 'Data inválida.'
  }

  return ''
}
