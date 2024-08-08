/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'src/components'
import {
  Autocomplete,
  AutocompleteOptions,
} from 'src/components/Form/Autocomplete'
import { toast } from 'src/components/Widgets/Toastify'
import { exceptionHandle } from 'src/helpers/exceptions'
import { formatInputPrice, formatPrice } from 'src/helpers/formatPrice'
import hasNumber from 'src/helpers/hasNumber'
import { useModal } from 'src/hooks/useModal'
import { useAdmin } from 'src/services/useAdmin'
import { IStore, ServiceT } from 'src/store/Types'
import { Row } from 'src/styles'
import EditPiece from 'src/views/modules/administration/pieces/edit'
import useLocalStorage from 'use-local-storage'
import InputText from '../../../../components/InputCurrency'
import { useTotalSum } from '../../../../hooks/useTotalSum'
import { ItemPieces } from '../../../../type'

type TableViewPiecesProps = {
  setItemPieces: React.Dispatch<React.SetStateAction<ItemPieces[]>>
  setIdRowWarning: React.Dispatch<React.SetStateAction<string>>
  setIsFirstLoadingPage: React.Dispatch<React.SetStateAction<boolean>>
  itemPieces: ItemPieces[]
}

export const ItemLaudoPieces: React.FC<TableViewPiecesProps> = ({
  setItemPieces,
  setIdRowWarning,
  itemPieces,
  setIsFirstLoadingPage
}) => {
  const [valueUnit, setValueUnit] = useState('')
  const [msgError, setMsgError] = useState('')
  const [msgErrorAutoComplete, setMsgErrorAutoComplete] = useState('')
  const [totalValue, setTotalValue] = useState('')
  const [qtdeValue, setQtdeValue] = useState('')
  const [itemAutocompleteClicked, setItemAutocompleteClicked] = useState('')
  const [clickedValuePiece, setClickedValuePiece] = useLocalStorage('os-clickedValuePiece', {} as AutocompleteOptions)
  const { sum } = useTotalSum()
  const { apiAdmin } = useAdmin()
  const { showMessage } = useModal()
  const [optionPiece, setOptionPiece] = useState<AutocompleteOptions[]>(
    [] as AutocompleteOptions[],
  )
  const [valuePiece, setValuePiece] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const makeRequest = useSelector((state: IStore) => state.layout.makeRequest)

  const getPieceById = async (id: string | number) => {
    try {
      const { data } = await apiAdmin.get(`pieces/${id}`)
      return data
    } catch (error) {
      exceptionHandle(error)
    }
  }

  const calcPrice = (qtde: string) => {
    if (qtde?.trim() !== '') {
      const resultCalc = Number(qtde) * Number(pieces?.value)
      setTotalValue(formatPrice(resultCalc))
      setMsgError('')
      sum(resultCalc)
      addValueArrayPieces({
        description: valuePiece.label,
        id: String(valuePiece.value),
        qtde: Number(qtde),
        total: resultCalc,
        unit: pieces?.value,
      })
    } else {
      setTotalValue(formatPrice(pieces?.value))
      setMsgError('Obrigatório!')
      sum(pieces?.value)
    }
  }

  const handleRemoveItemPieces = () => {
    setItemPieces((previousState) => [
      ...previousState.filter(
        (item) => item.description !== itemAutocompleteClicked,
      ),
    ])
  }

  const handleChange = (qtde: string) => {
    if (hasNumber(qtde)) {
      calcPrice(qtde)
    } else {
      setQtdeValue('')
    }
  }

  const pieces = useSelector(
    (state: IStore) =>
      state.piece.pieces.filter(
        (service) => service._id === valuePiece?.value,
      )[0],
  )

  const addValueArrayPieces = (itemPiece: ItemPieces) => {
    // setItemPieces((previousState) => [
    //   ...previousState.filter(
    //     (item: ItemPieces) => item.id !== valuePiece.value,
    //   ),
    //   itemPiece,
    // ])
  }

  const clearValues = () => {
    setQtdeValue('')
    setValueUnit('')
    setTotalValue('')
  }

  const setValueInFields = () => {
    setValueUnit(formatPrice(pieces?.value))
    setQtdeValue('1')
    calcPrice('1')
    addValueArrayPieces({
      description: valuePiece.label,
      id: String(valuePiece.value),
      qtde: 1,
      total: Number(pieces?.value),
      unit: pieces?.value,
    })
    setMsgErrorAutoComplete('')
  }

  useEffect(() => {
    if (pieces?.value) {
      setValueInFields()
      // setItemPieces((previousState) => {
      //   const result = previousState.filter(
      //     (item: ItemPieces) => item.description === valuePiece.label,
      //   )
      //   handleRemoveItemPieces()
      //   if (!result.length) {
      //     setValueInFields()
      //   } else {
      //     setMsgErrorAutoComplete(
      //       'Essa peças já foi adicionada, escolha outra.',
      //     )
      //     clearValues()
      //   }
      //   return previousState
      // })
    } else {
      setMsgErrorAutoComplete('')
      clearValues()
      setIdRowWarning('')
      //handleRemoveItemPieces()
    }
  }, [valuePiece])

  useEffect(() => {
    //let cancel: any

    const loadPiece = async () => {
      try {
        const { data } = await apiAdmin.get(`pieces`, {
          params: {
            description:
              (valuePiece.value === 0 && valuePiece.label) || undefined,
          },
          //cancelToken: new axios.CancelToken((c) => (cancel = c)),
        })

        const dataMapped = data?.map((val: ServiceT) => {
          const valueFormated = formatPrice(val.value)
          return {
            value: val._id,
            label: `[${valueFormated}] - ${val.description}`,
          }
        })

        setOptionPiece(dataMapped)
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message)
        }
      }
    }
    loadPiece()

    //return () => cancel && cancel()
  }, [valuePiece, makeRequest])

  /**
   * @description
   * The "onFormatterPrice" function aims to format the price input value.
   * It receives the value in string format as a parameter and uses the "formatInputPrice" function to obtain the formatted value.
   * Then, the "setValueUnit" function is called with the formatted value to update the application state.
   * This function is useful for ensuring that the price is displayed consistently and readably for the user.
   */
  const onFormatterPrice = (value: string) => {
    const { formated } = formatInputPrice(value)
    setValueUnit(formated)
  }

  const onHandleSelectedAutocomplete = ({ target }) => {
    if (!msgErrorAutoComplete) {
      setItemAutocompleteClicked(target.defaultValue)
    }
  }

  const onHandleEditPiece = async () => {
    setIdRowWarning('')
    const id = clickedValuePiece?.value
    const dataPiece = await getPieceById(id)
    showMessage(
      EditPiece,
      {
        isNewServiceByOS: true,
        dataPiece,
      },
      true,
    )
  }

  const checkIfAlreayExistsPieceinList = (id: string | number, qtde: number) => {
    setIdRowWarning('')
    if (itemPieces?.length) {
      if (itemPieces?.length === 6) {
        toast.warning('A quantidade de peça permitido é 6.')
        return false
      }
      const resultItemServices = itemPieces.find((item) => item.id === id)
      if (resultItemServices) {
        if (resultItemServices.qtde !== qtde) {
          toast.warning(`Já existe uma peça adicionada com a quantidade diferente, remova a peça da lista abaixo para adicionar ou informe a mesma quantidade.`)
          setIdRowWarning(String(id))
          return false
        }
        return true
      } else {
        return true
      }
    } else {
      return true
    }
  }

  const addPiece = () => {

    setIsFirstLoadingPage(false)

    const { clean: totalValueClean } = formatInputPrice(totalValue)
    const { clean: valueUnitClean } = formatInputPrice(valueUnit)

    if (!valuePiece?.label) {
      toast.warning('Primeiro selecione a peça para depois adicionar.')
      return
    }

    if (!checkIfAlreayExistsPieceinList(valuePiece?.value, Number(qtdeValue))) return

    setItemPieces((previousState) => [
      ...previousState.filter((item) => item.id !== valuePiece?.value),
      {
        id: valuePiece?.value,
        description: valuePiece?.label,
        qtde: Number(qtdeValue),
        unit: valueUnitClean,
        total: totalValueClean
      }
    ])
    setMsgErrorAutoComplete('')
    clearValues()
    setValuePiece({ label: '', value: '' })
    setClickedValuePiece({ label: '', value: '' })
    setIdRowWarning('')
  }

  useEffect(() => {
    if (pieces) {
      const idServiceCurrent = valuePiece.value
      const idStateUpdated = pieces._id
      if (idServiceCurrent === idStateUpdated) {
        if (valuePiece.label.trim() !== pieces.description.trim()) {
          setValuePiece({ label: pieces.description, value: idStateUpdated })
        } else {
          setValueInFields()
        }
      }
    }
  }, [pieces])

  return (
    <Row columns="5fr 0.1fr 1fr 1fr 1fr" gap={10} marginTop="5px">
      <Autocomplete
        value={valuePiece}
        setValue={setValuePiece}
        options={optionPiece}
        setOptions={setOptionPiece}
        hasError={!!msgErrorAutoComplete}
        error={msgErrorAutoComplete}
        onSelect={onHandleSelectedAutocomplete}
        setClickedValue={(value) => {
          setClickedValuePiece(value)
        }}
        isHasEdit={!!clickedValuePiece?.label}
        onHandleClickButtonLabelEdit={onHandleEditPiece}
      />
      <InputText
        value={qtdeValue}
        mask={''}
        disabled={
          pieces?.value === undefined || !!msgErrorAutoComplete ? true : false
        }
        setValue={setQtdeValue}
        onChange={(event) => setQtdeValue && setQtdeValue(event.target.value)}
        onKeyUp={() => handleChange(qtdeValue)}
        hasError={!!msgError}
        msgError={msgError}
        width="60px"
      />
      <InputText
        type="text"
        label={''}
        value={valueUnit}
        autoComplete="off"
        onChange={(event) => setValueUnit && setValueUnit(event.target.value)}
        onKeyUp={() => onFormatterPrice(valueUnit)}
        disabled
      />
      <InputText
        type="text"
        label={''}
        value={totalValue}
        autoComplete="off"
        disabled
      />
      <Row display='flex' justifyContent='center' alignItems='center'>
        <Button
          textButton={'Adicionar'}
          variant={"outlined"}
          size="large"
          icon={"add2"}
          color={'primary'}
          onClick={addPiece}
        />
      </Row>
    </Row>
  )
}
