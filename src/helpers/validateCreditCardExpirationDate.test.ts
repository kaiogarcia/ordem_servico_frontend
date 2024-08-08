/* eslint-env node, jest */
import moment from 'moment'
import validateCreditCardExpirationDate from './validateCreditCardExpirationDate'

it('should validate as truthy', () => {
  const expirationDate = `${moment().add(2, 'month').format('MM/YY')}`

  expect(validateCreditCardExpirationDate(expirationDate)).toBeTruthy()
})

it('should validate as falsy', () => {
  expect(validateCreditCardExpirationDate('13/22')).toBeFalsy()
  expect(validateCreditCardExpirationDate('8/21')).toBeFalsy()
})
