/* eslint-disable no-restricted-globals */
import React, { useState } from 'react'
import useLocalStorage from 'use-local-storage'
import Filters from './Filters'
import TableView from './Table'
import { Expense } from './Table/adapter'

const SeeAllExpenses: React.FC = () => {
  const [incomesFiltered, setIncomesFiltered] = useState<Expense[]>(
    [] as Expense[],
  )
  const [makeRequest, setMakeRequest] = useLocalStorage<number>(
    'makeRequest',
    undefined,
  )

  React.useEffect(() => {
    scroll(0, 0)
  }, [])

  return (
    <>
      <Filters
        setIncomesFiltered={setIncomesFiltered}
        makeRequest={makeRequest}
        setMakeRequest={setMakeRequest}
      />
      <TableView
        incomesFiltered={incomesFiltered}
        setMakeRequest={setMakeRequest}
      />
    </>
  )
}

export default SeeAllExpenses
