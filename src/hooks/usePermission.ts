import { useAuth } from './useAuth'

export const usePermission = () => {
  const { user } = useAuth()
  const hasPermission = (permissionKey: string) => {
    const permissions = user?.user?.permission
    if (permissions.find((permission) => permission?.key === permissionKey)) {
      return true
    } else {
      return false
    }
  }
  return { hasPermission }
}
