import React from 'react'

export type MappedDataServiceOrders = {
  id: string
  name: string
  description?: string
  clientName?: string
  osNumber: string
  dateOS: string
  total: string
  status: string
  typeDocument: string
  idFileCreatedGoogleDrive?: string
  clientId?: string
  isSendNowDayMaturityBoleto?: boolean
  isSendThreeDayMaturityBoleto?: boolean
  dateGeneratedOS?: string
  phoneNumber?: string
  isPartial?: boolean
  isBoletoUploaded?: boolean
  formOfPayment?: string
  setMakeRequest?: React.Dispatch<React.SetStateAction<number>>
}

export type DeleteDocuments = {
  fileName: string
  loading?: boolean
  deleteDocument: (fileName: string) => Promise<void>
  setMakeRequest?: React.Dispatch<React.SetStateAction<number>>
}
