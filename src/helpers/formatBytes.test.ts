/* eslint-env node, jest */
import formatBytes from './formatBytes'

it('should format bytes', () => {
  expect(formatBytes(10)).toBe('10 Bytes')
  expect(formatBytes(100)).toBe('100 Bytes')
  expect(formatBytes(1024)).toBe('1 KB')
  expect(formatBytes(Math.pow(1024, 2))).toBe('1 MB')
  expect(formatBytes(Math.pow(1024, 3))).toBe('1 GB')
  expect(formatBytes(Math.pow(1024, 4))).toBe('1 TB')
  expect(formatBytes(Math.pow(1024, 5))).toBe('1 PB')
  expect(formatBytes(Math.pow(1024, 6))).toBe('1 EB')
  expect(formatBytes(Math.pow(1024, 7))).toBe('1 ZB')
  expect(formatBytes(Math.pow(1024, 8))).toBe('1 YB')
})
