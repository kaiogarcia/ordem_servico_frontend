export const getFirstName = (nameComplete: string): string => {
  const nomes = nameComplete?.trim()?.split(' ')
  if (nomes) {
    return nomes[0]
  }
  return ''
}
