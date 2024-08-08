export const formatPhone = (phone) => {
  if (typeof phone === 'string') {
    const separatorPosition = phone.length === 11 ? 7 : 6

    return `(${phone.slice(0, 2)}) ${phone.slice(
      2,
      separatorPosition,
    )}-${phone.slice(separatorPosition, 12)}`
  }
  return ''
}
