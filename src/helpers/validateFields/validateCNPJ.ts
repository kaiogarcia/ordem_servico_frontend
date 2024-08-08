import { validateCNPJ } from '../validateCNPJ'

export const validateCNPJfield = (
  cnpj: string,
  // alreadyExist = false,
): string => {
  if (!cnpj.trim()) {
    return 'CNPJ Obrigatório.'
  }

  if (!validateCNPJ(cnpj)) {
    return 'CNPJ inválido'
  }

  // if (alreadyExist) {
  //   return 'Este CPF já está cadastrado na plataforma Rita, por favor verifique os dados e preencha novamente'
  // }

  return ''
}
