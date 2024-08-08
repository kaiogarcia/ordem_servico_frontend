interface ColumnProps {
  field: AutocompleteOptions
  setField: (newState: AutocompleteOptions) => void
}

import { useState } from 'react'
import { AutocompleteOptions } from 'src/components/Form/Autocomplete'

export const useStateLaudoTech = () => {
  const [valueLaudoTech01, setLaudoTech01] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const [valueLaudoTech02, setLaudoTech02] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const [valueLaudoTech03, setLaudoTech03] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const [valueLaudoTech04, setLaudoTech04] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const [valueLaudoTech05, setLaudoTech05] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const [valueLaudoTech06, setLaudoTech06] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const [valueLaudoTech07, setLaudoTech07] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const [valueLaudoTech08, setLaudoTech08] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const [valueLaudoTech09, setLaudoTech09] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )

  const statesLaudoTech = () => {
    const columns: ColumnProps[] = [
      { field: valueLaudoTech01, setField: setLaudoTech01 },
      { field: valueLaudoTech02, setField: setLaudoTech02 },
      { field: valueLaudoTech03, setField: setLaudoTech03 },
      { field: valueLaudoTech04, setField: setLaudoTech04 },
      { field: valueLaudoTech05, setField: setLaudoTech05 },
      { field: valueLaudoTech06, setField: setLaudoTech06 },
      { field: valueLaudoTech07, setField: setLaudoTech07 },
      { field: valueLaudoTech08, setField: setLaudoTech08 },
      { field: valueLaudoTech09, setField: setLaudoTech09 },
    ]
    return columns
  }

  return {
    statesLaudoTech,
    state: {
      valueLaudoTech01,
      setLaudoTech01,
      valueLaudoTech02,
      setLaudoTech02,
      valueLaudoTech03,
      setLaudoTech03,
      valueLaudoTech04,
      setLaudoTech04,
      valueLaudoTech05,
      setLaudoTech05,
      valueLaudoTech06,
      setLaudoTech06,
      valueLaudoTech07,
      setLaudoTech07,
      valueLaudoTech08,
      setLaudoTech08,
      valueLaudoTech09,
      setLaudoTech09,
    },
  }
}
