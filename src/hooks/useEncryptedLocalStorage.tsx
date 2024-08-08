import React from 'react'
import useLocalStorage from 'use-local-storage'
import CryptoJS from 'crypto-js'

type DataType<T> = T | string | number | boolean | object | Array<any>

function useEncryptedLocalStorage<T>(
  key: string,
  initialValue: DataType<T>,
): [DataType<T>, (value: DataType<T>) => void] {
  const [storedValue, setStoredValue] = useLocalStorage(key, initialValue)

  const encryptData = (data: DataType<T>): string => {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      'your-secret-key',
    )
    return encrypted.toString()
  }

  const decryptData = (encryptedData: string): DataType<T> => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'your-secret-key')
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decrypted)
  }

  const setValue = (value: DataType<T>): void => {
    const encryptedValue = encryptData(value)
    setStoredValue(encryptedValue)
  }

  let decryptedValue: DataType<T>

  if (typeof storedValue === 'string') {
    decryptedValue = decryptData(storedValue)
  } else {
    decryptedValue = storedValue
  }

  return [decryptedValue, setValue]
}

// // Use example:
// const [equipamentName, setEquipamentName] = useEncryptedLocalStorage(
//   'equipamentName',
//   {} as AutocompleteOptions,
// )

export default useEncryptedLocalStorage
