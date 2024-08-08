import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { formatInputPrice, formatPrice } from 'src/helpers/formatPrice'
import { SERVICE_ORDER_CREATE } from 'src/store/actions'
import { IStore } from 'src/store/Types'

/** This function is not used */
export const useTotalSum = () => {
  const { total, laudos } = useSelector(
    (state: IStore) => state.createServiceOrder.createServiceOrder,
  )

  const dispatch = useDispatch()

  const sum = (valuetoSum: number | string) => {
    let totalSum = 0
    if (!_.isNumber(valuetoSum)) {
      const { clean } = formatInputPrice(valuetoSum)
      totalSum = total ? total + clean : clean
    } else {
      totalSum = total ? total + valuetoSum : valuetoSum
    }
    dispatch({
      type: SERVICE_ORDER_CREATE,
      payload: {
        laudos,
        total: totalSum,
      },
    })
    return formatPrice(totalSum)
  }

  const resetTotal = () => {
    dispatch({
      type: SERVICE_ORDER_CREATE,
      payload: {
        laudos,
        total: 0,
      },
    })
  }

  return { sum, resetTotal }
}
