export type FromApiProps = {
  _id: string
  name: string
  address: string
  city: string
  uf: string
  cpfOrCnpj: string
  email: string
  phoneNumber: string
  phoneNumberFixo: string
  cep: string
  user: string
  idFolderClientName: string
  idFolderOrcamento: string
  idFolderOsPagas: string
  idFolderOsPendentes: string
  idFolderOsUnificadas: string
  __v?: 0
}

export type ResponseApiClient = {
  address: string
  city: string
  uf: string
  cep: string
  cpfOrCnpj: string
  email: string
  name: string
  phoneNumber: string
  id: string
  phoneNumberFixo: string
  idFolderClientName: string
  idFolderOrcamento: string
  idFolderOsUnificadas: string
  idFolderOsPendentes: string
  idFolderOsPagas: string
  isSendFilesWhatsappNotification?: boolean
}

export const fromApiClient = (data: FromApiProps): ResponseApiClient => {
  return {
    address: data.address,
    city: data.city,
    uf: data.uf,
    cep: data.cep,
    cpfOrCnpj: data.cpfOrCnpj,
    email: data.email,
    name: data.name,
    phoneNumber: data.phoneNumber,
    id: data._id,
    phoneNumberFixo: data.phoneNumberFixo,
    idFolderClientName: data.idFolderClientName,
    idFolderOrcamento: data.idFolderOrcamento,
    idFolderOsUnificadas: data.idFolderOsUnificadas,
    idFolderOsPendentes: data.idFolderOsPendentes,
    idFolderOsPagas: data.idFolderOsPagas,
  }
}
