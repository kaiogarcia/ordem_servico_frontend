export type User = {
  _id?: string
  name: string
  email?: string
  cpf: string
  id: string
  typeUser?: string
  status?: string
  password?: string
  permissions?: PermissionUser[]
}

export type PermissionUser = {
  name: string
  key: string
  icon?: any
  id?: string
}
