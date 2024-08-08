export const validateFullName = (name: string, minLength = 0): string => {
  if (!name.trim()) {
    return 'Nome Obrigatório.'
  }

  if (minLength > 0 && name.length < minLength) {
    return `Nome deve ter no mínimo ${minLength} caracteres`
  }

  return ''
}
