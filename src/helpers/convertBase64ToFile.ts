export const converBase64ToFile = async (
  photoBase64: string,
  filename = 'foto',
  type = 'png',
): Promise<File> => {
  if (!photoBase64) {
    return
  }
  const base64 = await fetch(photoBase64)
  const blob = await base64.blob()
  const file = new File([blob], `${filename}.${type}`, {
    type: 'image/' + type,
  })
  return file
}
