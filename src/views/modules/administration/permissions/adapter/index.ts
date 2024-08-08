import { formatCpf } from 'src/helpers/formatCpf'
import { User } from '../type'

export const fromApi = (users: User[]): User[] => {
  return users.map((user) => ({
    ...user,
    cpf: formatCpf(user.cpf),
  }))
}
