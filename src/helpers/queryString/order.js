export const queryOrderString = (obj) => {
  if (!obj || !Object.keys(obj).length) return ''

  return `&orderBy=${obj.name}&order=${obj.value}`
}
