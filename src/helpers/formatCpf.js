export const formatCpf = (cpf) => {
  if (!cpf || cpf.length !== 11) {
    return cpf
  }

  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
