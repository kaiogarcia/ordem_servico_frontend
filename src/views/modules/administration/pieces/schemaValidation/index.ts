import * as yup from 'yup'

export const schemaPiece = yup
  .object({
    description: yup.string().required('Nome da peça obrigatório'),
    value: yup.string().required('Preço da peça obrigatório'),
  })
  .required()
