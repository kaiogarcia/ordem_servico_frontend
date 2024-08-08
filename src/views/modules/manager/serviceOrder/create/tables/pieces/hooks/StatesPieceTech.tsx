import { useState } from 'react'
import { useSelector } from 'react-redux'
import { AutocompleteOptions } from 'src/components/Form/Autocomplete'
import { IStore } from 'src/store/Types'

export const useStatePieceTech = () => {
  const [valuePieceTech01, setPieceTech01] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const [valuePieceTech02, setPieceTech02] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const [valuePieceTech03, setPieceTech03] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const [valuePieceTech04, setPieceTech04] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const [valuePieceTech05, setPieceTech05] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const [valuePieceTech06, setPieceTech06] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const [valuePieceTech07, setPieceTech07] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const [valuePieceTech08, setPieceTech08] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const [valuePieceTech09, setPieceTech09] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )

  const [columns, setColumns] = useState([])
  const pieces = useSelector((state: IStore) => state.piece.pieces)

  const statesPieceTech = (index: number) => {
    const stateDinamyc = [
      {
        field1: valuePieceTech01,
        setField1: setPieceTech01,
      },
      { field2: valuePieceTech02, setField2: setPieceTech02 },
      { field3: valuePieceTech03, setField3: setPieceTech03 },
      { field4: valuePieceTech04, setField4: setPieceTech04 },
      { field5: valuePieceTech05, setField5: setPieceTech05 },
      { field6: valuePieceTech06, setField6: setPieceTech06 },
      { field7: valuePieceTech07, setField7: setPieceTech07 },
      { field8: valuePieceTech08, setField8: setPieceTech08 },
      { field9: valuePieceTech09, setField9: setPieceTech09 },
    ]
    if (!columns.filter((item) => item[`field${index}`]).length) {
      if (columns.length + 1 <= pieces?.length) {
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
    statesPieceTech,
    state: {
      valuePieceTech01,
      setPieceTech01,
      valuePieceTech02,
      setPieceTech02,
      valuePieceTech03,
      setPieceTech03,
      valuePieceTech04,
      setPieceTech04,
      valuePieceTech05,
      setPieceTech05,
      valuePieceTech06,
      setPieceTech06,
      valuePieceTech07,
      setPieceTech07,
      valuePieceTech08,
      setPieceTech08,
      valuePieceTech09,
      setPieceTech09,
    },
  }
}
