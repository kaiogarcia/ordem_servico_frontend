import { PieceT, PieceToApiT } from 'src/store/Types'

export const toApi = (data: PieceT, valueClear: number): PieceToApiT => {
  return {
    description: data.description,
    value: valueClear,
  }
}
