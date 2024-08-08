import * as yup from 'yup'

export const schemaServiceOrder = yup
  .object({
    // cable: yup.string().required('Campo obrigatório'),
    // charger: yup.string().required('Campo obrigatório'),
    // breaked: yup.string().required('Campo obrigatório'),
    // detail: yup.string().required('Campo obrigatório'),
    typeDocument: yup.string().required('Tipo de documento obrigatório'),
  })
  .required()
