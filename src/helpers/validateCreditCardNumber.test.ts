/* eslint-env node, jest */
import validateCreditCardNumber from './validateCreditCardNumber'

it('should validate as truthy', () => {
  expect(validateCreditCardNumber('5597 8621 3314 7562')).toBeTruthy() // Maggie Anni - 8/22 - 792
  expect(validateCreditCardNumber('5139678748795198')).toBeTruthy() // Mersey Giulietta - 9/23 - 391
})

it('should validate as falsy', () => {
  expect(validateCreditCardNumber('1111111111111111')).toBeFalsy()
})
