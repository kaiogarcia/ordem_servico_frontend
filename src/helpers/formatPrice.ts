import onlyNumbers from './clear/onlyNumbers'

type Price = {
  formated: string
  clean: number
}

const formatToApi = (value: string | number) => {
  return Number(
    String(value).replace('R$', '').replace('.', '').replace(',', '.'),
  )
}

// const formatPriceOnChange = (value: string | number): Price => {
//   let newValue: number | string = onlyNumbers(value)

//   let formatedValue = ''

//   if (newValue.length !== 2) {
//     newValue = newValue.replace(/([0-9]{2})$/g, ',$1')
//   }

//   if (newValue.length > 6) {
//     newValue = newValue.replace(/([0-9]{3}),([0-9]{2}$)/g, '.$1,$2')
//   }

//   if (newValue.length === 2) {
//     formatedValue = newValue ? 'R$ ' + `${newValue},00` : ''
//   } else {
//     formatedValue = newValue ? 'R$ ' + newValue : ''
//   }

//   if (newValue === 'NaN') return null

//   return {
//     formated: formatedValue,
//     clean: formatToApi(formatedValue),
//   }
// }

const formatInputPriceOnChange = (value: string | number): Price => {
  let newValue: number | string = onlyNumbers(value)

  newValue = newValue.replace(/([0-9]{2})$/g, ',$1')

  if (newValue.length > 6) {
    newValue = newValue.replace(/([0-9]{3}),([0-9]{2}$)/g, '.$1,$2')
  }

  const formatedValue = newValue ? 'R$ ' + newValue : ''

  if (newValue === 'NaN') return null

  return {
    formated: formatedValue,
    clean: formatToApi(formatedValue),
  }
}

// export const formatPrice = (price): Price => {
//   if (!price && price !== 0) {
//     return {} as Price
//   }
//   return formatPriceOnChange(price)
// }

export const formatInputPrice = (price): Price => {
  if (!price && price !== 0) {
    return {} as Price
  }
  return formatInputPriceOnChange(price)
}

export const formatPrice = (value: String | number) => {
  if (value) {
    return Number(value).toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    })
  } else {
    return 'R$ 0,00'
  }
}
