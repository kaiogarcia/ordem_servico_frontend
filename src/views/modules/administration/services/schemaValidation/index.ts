import * as yup from 'yup'

export const schemaService = yup
  .object({
    description: yup.string().required('Nome do serviço obrigatório'),
    value: yup.string().required('Campo obrigatório'),
    //laudoService: yup.string().required('Campo obrigatório'),
  })
  .required()
