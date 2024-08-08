import clearSpecialCharacters from 'src/helpers/clearSpecialCharacters'
import { User } from '../../type'

export const toApi = (data: User): User => {
  return {
    name: data.name,
    email: data.email || '',
    cpf: clearSpecialCharacters(data.cpf),
    typeUser: data.typeUser,
    id: data?.id || undefined,
    password: data?.password,
    status: 'ATIVO',
    permissions: data?.permissions.map((p) => ({
      key: p.key,
      name: p.name,
    })),
  }
}
