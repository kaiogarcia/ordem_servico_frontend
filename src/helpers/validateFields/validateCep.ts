import clear from '../clearSpecialCharacters'

export const validateCep = (value: string): string => {
  if (!value.trim()) {
    return 'Cep Obrigatório.'
  }

  if (clear(value).length > 0 && clear(value).length < 8) {
    return 'Cep Inválido.'
  }

  return ''
}
