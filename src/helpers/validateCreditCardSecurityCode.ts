// @ts-ignore
import * as creditCardJS from 'creditcard.js'
import clearOnlyNumbers from './clear/onlyNumbers'

export default function (code: string, number: string) {
  const numberFormatted = clearOnlyNumbers(number)

  return (
    Boolean(code) &&
    Boolean(numberFormatted) &&
    creditCardJS.isSecurityCodeValid(numberFormatted, code)
  )
}
