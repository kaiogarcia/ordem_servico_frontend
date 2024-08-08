/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'

type Props = {
  watch: any
  setCable: (previousState: any) => void
  setCharger: (previousState: any) => void
  setBreaked: (previousState: any) => void
  setDetail: (previousState: any) => void
  setValue: any
}

export const useAddLocalStorage = ({
  watch,
  setCable,
  setCharger,
  setBreaked,
  setDetail,
}: Props) => {
  const cable = watch('cable')
  const charger = watch('charger')
  const breaked = watch('breaked')
  const detail = watch('detail')

  useEffect(() => {
    setCable(cable)
    setCharger(charger)
    setBreaked(breaked)
    setDetail(detail)
  }, [cable, charger, breaked, detail])
}
