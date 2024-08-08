import { format } from 'date-fns'

/**
 * @param {string} date
 * @param {string} _format
 * @description Basta passar o formato da data no segundo parâmetro,
 * por exemplo: dd/MM/yyyy ou dd-MM-yyyy ou yyyy/MM/dd
 * O formato default é yyyy-MM-dd se caso não informar o _format.
 */
export const formatCustomDate = (date: Date, _format?: string): string => {
  if (!date) return null
  if (!_format) _format = 'yyyy-MM-dd'
  const str = String(date)

  if (str.replace(/\D/g, '') === '') return null

  return format(new Date(str), _format)
}
