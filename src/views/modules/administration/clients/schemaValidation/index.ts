import * as yup from 'yup'

export const schemaClient = yup
  .object({
    name: yup.string().required('Nome Obrigatório'),
    // idFolderClientName: yup
    //   .string()
    //   .required('Id da Pasta do Cliente Obrigatório'),
    // idFolderOrcamento: yup
    //   .string()
    //   .required('Id da Pasta de Orçamentos Obrigatório'),
    // idFolderOsUnificadas: yup
    //   .string()
    //   .required('Id da Pasta de OS Unificadas Obrigatória'),
    // idFolderOsPendentes: yup
    //   .string()
    //   .required('Id da Pasta de OS Pendentes Obrigatória'),
    // idFolderOsPagas: yup
    //   .string()
    //   .required('Id da Pasta de OS Pagas Obrigatório'),
    // cpfOrCnpj: yup.string().required('CPF/CNPJ obrigatório'),
    phoneNumber: yup.string(),
    email: yup.string().email('Email inválido'),
    // address: yup.string(),
    // city: yup.string(),
    uf: yup.string().max(2, 'Máximo 2 caracteres.'),
  })
  .required()
