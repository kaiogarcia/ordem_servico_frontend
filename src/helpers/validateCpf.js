export default function validateCpf(cpf) {
  const newCpf = [...cpf].toString().replace(/\D+/g, '')
  if (newCpf.length < 11) return false
  if (
    newCpf === '00000000000' ||
    newCpf === '11111111111' ||
    newCpf === '22222222222' ||
    newCpf === '33333333333' ||
    newCpf === '44444444444' ||
    newCpf === '55555555555' ||
    newCpf === '66666666666' ||
    newCpf === '77777777777' ||
    newCpf === '88888888888' ||
    newCpf === '99999999999'
  )
    return false
  const arrayCpf = newCpf.split('')
  const doisDigitos = arrayCpf.splice(-2)

  const digito = Array.from(newCpf.slice(0, 9))
  const digito2 = Array.from(newCpf.slice(0, 10))

  let contador = 10
  let contador2 = 11

  const calculo = digito.reduce((ac, val) => {
    ac += Number(val) * contador
    --contador
    return ac
  }, 0)

  const calculo2 = digito2.reduce((ac, val) => {
    ac += Number(val) * contador2
    --contador2
    return ac
  }, 0)

  const result = 11 - (calculo % 11)
  const result2 = 11 - (calculo2 % 11)
  const valores = [result, result2]

  // digito maior que 10 seta 0
  for (let i = 0; i <= valores.length; i++) {
    if (valores[i] >= 10) valores[i] = 0
  }

  const cpfValido = valores.join('') === doisDigitos.join('')

  if (cpfValido) return true
  else return false
}
