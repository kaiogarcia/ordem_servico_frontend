export const isValidTypeFileExcel = (file: File | string): boolean => {
  if (typeof file === 'object') {
    const fileType = file.name.split('.').pop()
    const typesFile = ['xls', 'xlsx']

    const isValid = typesFile.includes(String(fileType))

    return isValid
  }

  return false
}
