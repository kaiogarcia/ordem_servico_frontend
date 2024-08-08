export const formatMobilePhone = (phone) => {
  if (typeof phone === 'string') {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`
  }

  return ''
}
