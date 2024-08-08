import { EquipamentT } from 'src/store/Types'

export const toApi = (data: EquipamentT): EquipamentT => {
  return {
    equipamentName: data.equipamentName,
    brand: data.brand,
    model: data.model,
    serialNumber: data.serialNumber,
    id: data._id,
  }
}
