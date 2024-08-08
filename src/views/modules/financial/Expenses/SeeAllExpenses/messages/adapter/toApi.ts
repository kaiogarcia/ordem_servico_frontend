import { SeeAllExpenseProps } from '../../types'

type ToApi = {
  expense: string
  value: string
  dateIn: string
  maturity: string
  status: string
  expense_type: string
}

export const toApi = (data: SeeAllExpenseProps): ToApi => {
  return {
    expense: data.expense,
    value: data.valueFormated,
    dateIn: data.dateIn,
    maturity: data.maturity,
    status: data.status,
    expense_type: data.expense_type,
  }
}
