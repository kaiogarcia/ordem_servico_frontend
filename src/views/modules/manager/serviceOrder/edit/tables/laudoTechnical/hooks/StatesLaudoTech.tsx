import { useState } from 'react'
import { useSelector } from 'react-redux'
import { AutocompleteOptions } from 'src/components/Form/Autocomplete'
import { IStore } from 'src/store/Types'

interface ColumnProps {
  field: AutocompleteOptions
  setField: (newState: AutocompleteOptions) => void
}

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

  const [columns, setColumns] = useState([])
  const services = useSelector((state: IStore) => state.service.services)

  const statesLaudoTech = (index: number) => {
    const stateDinamyc = [
      {
        field1: valueLaudoTech01,
        setField1: setLaudoTech01,
      },
      { field2: valueLaudoTech02, setField2: setLaudoTech02 },
      { field3: valueLaudoTech03, setField3: setLaudoTech03 },
      { field4: valueLaudoTech04, setField4: setLaudoTech04 },
      { field5: valueLaudoTech05, setField5: setLaudoTech05 },
      { field6: valueLaudoTech06, setField6: setLaudoTech06 },
      { field7: valueLaudoTech07, setField7: setLaudoTech07 },
      { field8: valueLaudoTech08, setField8: setLaudoTech08 },
      { field9: valueLaudoTech09, setField9: setLaudoTech09 },
    ]

    if (!columns.filter((item) => item[`field${index}`]).length) {
      if (columns.length + 1 <= services?.length) {
        setColumns((current) => [
          ...current,
          stateDinamyc.filter((item) => item[`field${index}`])[0],
        ])
        return columns
      } else {
        return columns
      }
    } else {
      return columns
    }
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
