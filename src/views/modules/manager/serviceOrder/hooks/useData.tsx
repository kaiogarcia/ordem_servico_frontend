export const useData = () => {
  const data = JSON.parse(window.localStorage.getItem('oSData'))
  return data
}
