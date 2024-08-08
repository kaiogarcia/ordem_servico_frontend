export default function (value) {
  if (!value || typeof value !== 'string') return ''
  return value.split('T')[0].split('-').reverse().join('/')
}
