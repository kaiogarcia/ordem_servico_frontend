export const validateNumberHome = (value: string): string => {
  if (!value.trim()) {
    return 'Número Obrigatório.'
  }

  return ''
}
