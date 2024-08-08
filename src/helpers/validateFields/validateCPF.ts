import validateCpf from '../validateCpf'

export const validateCPF = (cpf: string, alreadyExist = false): string => {
  if (!cpf.trim()) {
    return 'CPF Obrigatório.'
  }

  if (!validateCpf(cpf)) {
    return 'CPF inválido'
  }

  if (alreadyExist) {
    return 'Este CPF já está cadastrado na plataforma, por favor verifique os dados e preencha novamente'
  }

  return ''
}
