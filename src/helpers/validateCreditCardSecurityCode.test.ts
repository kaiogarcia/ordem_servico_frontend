/* eslint-env node, jest */
import validateCreditCardSecurityCode from './validateCreditCardSecurityCode'

it('should validate as truthy', () => {
  expect(
    validateCreditCardSecurityCode('792', '5597 8621 3314 7562'),
  ).toBeTruthy()
  expect(validateCreditCardSecurityCode('391', '5139678748795198')).toBeTruthy()
})

it('should validate as falsy', () => {
  expect(validateCreditCardSecurityCode('abc', '1111111111111111')).toBeFalsy()
})
