import * as yup from 'yup'

export const schemaIncome = yup
  .object({
    income: yup.string().required('Receita obrigatória'),
    valueFormated: yup.string().required('Valor obrigatório'),
    dateIn: yup.string().required('Data de entrada obrigatório'),
    //maturity: yup.string().required('Data de vencimento obrigatório'),
    status: yup.string().required('Status obrigatório'),
  })
  .required()
