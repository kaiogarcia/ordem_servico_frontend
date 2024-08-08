export default (value: string): string => {
  if (value?.length < 14 || !value) return ''
  return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}
