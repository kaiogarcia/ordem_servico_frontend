/* eslint-env node, jest */
import convertWalletMoneyToCrown from './convertWalletMoneyToCrown'

it('should convert wallet money to crown', () => {
  expect(convertWalletMoneyToCrown(10.25)).toBe(1025)
})
