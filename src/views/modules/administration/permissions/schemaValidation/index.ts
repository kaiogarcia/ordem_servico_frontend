import * as yup from 'yup'

export const schemaUser = yup
  .object({
    name: yup.string().required('Nome obrigatório'),
    // email: yup.string().required('Marca obrigatório'),
    cpf: yup.string().required('CPF obrigatório'),
    password: yup.string().required('Senha obrigatória'),
    typeUser: yup.string().required('Tipo de usuário obrigatório'),
  })
  .required()
