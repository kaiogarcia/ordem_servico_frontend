const downloadFile = (file, labelName, extension) => {
  const date = new Date()
  const dateName =
    date.getFullYear() +
    ('00' + (date.getMonth() + 1)).slice(-2) +
    ('00' + date.getDate()).slice(-2) +
    '_' +
    ('00' + date.getHours()).slice(-2) +
    ('00' + date.getMinutes()).slice(-2) +
    ('00' + date.getSeconds()).slice(-2) +
    '_' +
    labelName

  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(file)
  link.target = '_blank'
  link.download = `${dateName}.${extension}`

  link.click()
  link.remove()
}

export default downloadFile
