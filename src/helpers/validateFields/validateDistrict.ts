export const validateDistrict = (value: string): string => {
  if (!value && !value.trim()) {
    return 'Bairro Obrigatório.'
  }

  return ''
}
