export const validateTermOfUse = (terms: boolean): string => {
  if (!terms) {
    return 'Por favor, aceite os termos para continuar.'
  }

  return ''
}
