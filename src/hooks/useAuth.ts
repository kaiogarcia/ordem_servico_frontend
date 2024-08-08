import { useDispatch, useSelector } from 'react-redux'
import { ACCOUNT_INITIALIZE } from 'src/store/actions'
import { IStore } from 'src/store/Types'

export const useAuth = () => {
  const userDataRedux = useSelector((state: IStore) => state.account)
  const dispatcher = useDispatch()
  const setUserData = (user: any, token?: string) => {
    const localData = {
      user: { ...userDataRedux.user, ...user },
      token: token ? token : userDataRedux.token,
    }
    dispatcher({
      type: ACCOUNT_INITIALIZE,
      payload: { ...localData, isLoggedIn: true },
    })
  }

  return { setUserData, user: userDataRedux }
}
