import { Expense } from '../Table/adapter'

export type SeeAllExpenseProps = {
  expense: string
  valueFormated: string
  valueFormatedPiece: string
  dateIn: string
  maturity: string
  status: string
  expense_type: string
}

export type FiltersProps = {
  setExpensesFiltered: React.Dispatch<React.SetStateAction<Expense[]>>
  makeRequest: number
}
