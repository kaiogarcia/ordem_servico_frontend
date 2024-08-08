import { ServiceApiT, ServiceT } from 'src/store/Types'

export const toApi = (
  data: ServiceT,
  valueClear: number,
  laudos: string[],
): ServiceApiT => {
  return {
    description: data.description,
    laudos: laudos,
    value: valueClear,
  }
}
