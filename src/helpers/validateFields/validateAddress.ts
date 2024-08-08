export const validateAddress = (value: string): string => {
  if (!value.trim()) {
    return 'Endereço Obrigatório.'
  }

  return ''
}
