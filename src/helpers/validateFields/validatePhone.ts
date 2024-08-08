import clearSpecialCharacters from '../clearSpecialCharacters'

export const validatePhone = (phone: string, isRequired = false): string => {
  const phoneCleared = clearSpecialCharacters(phone)

  const phoneIsValid = phoneCleared[0] !== '0' && phoneCleared[2] === '9'

  if (isRequired && !phoneCleared.length) {
    return 'Campo Obrigatório'
  }

  if (phoneCleared.length < 11 || !phoneIsValid) {
    return 'Celular inválido.'
  }

  return ''
}
