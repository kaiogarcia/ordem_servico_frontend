import * as yup from 'yup'

export const schemaBrand = yup
  .object({
    equipamentName: yup.string().required('Equipamento obrigatório'),
    brand: yup.string().required('Marca obrigatório'),
    model: yup.string().required('Modelo obrigatório'),
    //serialNumber: yup.string().required('Número de série obrigatório'),
  })
  .required()
