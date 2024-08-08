import moment from 'moment'
import { parse, intervalToDuration, isValid } from 'date-fns'

export const validateBirthDate = (
  value: string,
  mustBeMajorAge = false,
): string => {
  if (!value.trim()) {
    return 'Data de Nascimento Obrigatória'
  }

  const dateFormate = moment(value, 'DD/MM/YYYY', true)
  const birthDate = parse(value, 'dd/MM/yyyy', new Date())

  if (
    !dateFormate.isValid() ||
    moment().diff(dateFormate, 'years') >= 200 ||
    dateFormate.isAfter(moment())
  ) {
    return 'Data de Nascimento Inválida.'
  }

  if (mustBeMajorAge) {
    if (isValid(birthDate)) {
      const { years } = intervalToDuration({
        start: birthDate,
        end: new Date(),
      })

      if (years < 18) {
        return 'O titular deve ser maior de 18 anos'
      }
    }
  }

  return ''
}
