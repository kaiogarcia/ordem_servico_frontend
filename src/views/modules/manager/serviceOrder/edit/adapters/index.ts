import { EquipamentT } from 'src/store/Types'
import { OSData } from '../type'

export const fromApiSerialNumber = (equipaments: EquipamentT[]) => {
  const resultSerialNumber = equipaments
    .map((item) => ({
      label: item.serialNumber,
      value: item.serialNumber,
    }))
    .filter((item) => item.label)
  resultSerialNumber.push({
    label: 'SEM NÚMERO DE SÉRIE',
    value: 'SEM NÚMERO DE SÉRIE',
  })
  resultSerialNumber.push({ label: 'SEM PATRIMONIO', value: 'SEM PATRIMONIO' })
  return resultSerialNumber
}

export const toApi = (data: OSData, osNumber: string): OSData => {
  return {
    _id: data?._id,
    status: data.status || null,
    typeDocument: data.typeDocument || null,
    osNumber: osNumber,
    dateOS: data.dateOS || null,
    equipament: data.equipament || null,
    brand: data.brand || null,
    model: data.model || null,
    serialNumber: data.serialNumber || null,
    cable: data.cable || null,
    charger: data.charger || null,
    breaked: data.breaked || null,
    detail: data.detail || null,
    client: {
      name: data.client.name || null,
      address: data.client.address || null,
      city: data.client.city || null,
      uf: data.client.uf || null,
      cpfOrCnpj: data.client.cpfOrCnpj || null,
      email: data.client.email || null,
      phoneNumber: data.client.phoneNumber || null,
      phoneNumberFixo: data.client.phoneNumberFixo || null,
      cep: data.client.cep || null,
      id: data.client._id,
    },
    itemServices: data.itemServices || null,
    laudos: data.laudos || null,
    itemPieces: data.itemPieces || null,
    total: data.total || null,
    manpower: data.manpower || null,
    discount: data.discount || null,
    subTotal: data.subTotal || null,
    valuePartial: data.valuePartial || null,
    remainingValue: data.remainingValue || null,
  }
}
