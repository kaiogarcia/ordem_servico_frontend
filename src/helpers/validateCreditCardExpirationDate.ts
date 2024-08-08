// @ts-ignore
import * as creditCardJS from 'creditcard.js'

export default function (value: string): boolean {
  const [month, year] = (value || '').split('/')

  return (
    Boolean(month) &&
    Boolean(year) &&
    creditCardJS.isExpirationDateValid(month, year)
  )
}
