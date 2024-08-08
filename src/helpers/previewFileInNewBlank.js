const previewFileInNewBlank = (file) => {
  const sourceFile = window.URL.createObjectURL(file)

  return window.open(sourceFile, '_blank')
}

export default previewFileInNewBlank
