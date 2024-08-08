export const isValidSizeFile = (file: File | string): boolean => {
  if (typeof file === 'object') {
    const fileSizeInMb = file.size / Number((1024 * 1024).toFixed(2))

    return !!(fileSizeInMb < 10)
  }

  return false
}
