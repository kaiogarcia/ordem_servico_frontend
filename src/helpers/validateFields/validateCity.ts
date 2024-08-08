export const validateCity = (value: string): string => {
  if (!value.trim()) {
    return 'Cidade Obrigatória.'
  }

  return ''
}
