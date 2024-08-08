export const isValidTypeFile = (
  file: File | string,
  options?: any,
): boolean => {
  if (typeof file === 'object') {
    const fileType = file.type.split('/')[1]

    const typesFile = ['jpg', 'jpeg', 'png']

    if (!options?.onlyImage) {
      typesFile.push('pdf')
    }

    const isValid =
      typesFile.includes(fileType) && file.name.split('.')[1] !== 'jfif'

    return isValid
  }

  return false
}
