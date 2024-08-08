export default function (value, separator) {
  if (!value && typeof value !== 'string') return

  const separatorOrDefault = separator || ' '

  return (
    new Date(value).toLocaleDateString('pt-br') +
    separatorOrDefault +
    new Date(value).toLocaleTimeString('pt-br')
  )
}
