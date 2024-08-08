export const validateGender = (value: string): string => {
  if (!value) {
    return 'Gênero Obrigatório.'
  }
  return ''
}
