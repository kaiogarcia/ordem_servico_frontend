/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Autocomplete,
  AutocompleteOptions,
} from 'src/components/Form/Autocomplete'
import Button from 'src/components/Form/Button'
import { toast } from 'src/components/Widgets/Toastify'
import { exceptionHandle } from 'src/helpers/exceptions'
import { formatInputPrice, formatPrice } from 'src/helpers/formatPrice'
import hasNumber from 'src/helpers/hasNumber'
import { useModal } from 'src/hooks/useModal'
import { useAdmin } from 'src/services/useAdmin'
import { IStore, ServiceT } from 'src/store/Types'
import { SERVICE_SEE_ALL } from 'src/store/actions'
import { Row } from 'src/styles'
import { fromApi } from 'src/views/modules/administration/services/adapters'
import EditService from 'src/views/modules/administration/services/edit'
import useLocalStorage from 'use-local-storage'
import { fromApiService } from '../../../../adapters/fromApiService'
import InputText from '../../../../components/InputCurrency'
import { useTotalSum } from '../../../../hooks/useTotalSum'
import { ItemServices } from '../../../../type'
import { Laudo } from '../../../type'
import LaudoConfirmation from '../../../../messages/LaudoConfirmation'

type ItemLaudoTechnicalProps = {
  itemServices: ItemServices[]
  laudosList: Laudo[]
  clickedValue: AutocompleteOptions
  setIdRowWarning: React.Dispatch<React.SetStateAction<string>>
  setLaudos: React.Dispatch<React.SetStateAction<Laudo[]>>
  setLaudosList: React.Dispatch<React.SetStateAction<Laudo[]>>
  setIsFirstLoadingPage: React.Dispatch<React.SetStateAction<boolean>>
  setItemServices: React.Dispatch<React.SetStateAction<ItemServices[]>>
  setClickedValue: React.Dispatch<React.SetStateAction<AutocompleteOptions>>
}

// type FieldValue = { description?: string, id?: string, quantity?: number, total?: string, unit?: string }

export const ItemLaudoTechnical: React.FC<ItemLaudoTechnicalProps> = ({
  setClickedValue,
  itemServices,
  clickedValue,
  laudosList,
  setItemServices,
  setIdRowWarning,
  setIsFirstLoadingPage,
  setLaudos,
  setLaudosList,
}) => {
  const [valueUnit, setValueUnit] = useState('')
  const dispatch = useDispatch()
  const { showMessage } = useModal()
  const [msgError, setMsgError] = useState('')
  const [msgErrorAutoComplete, setMsgErrorAutoComplete] = useState('')
  const [totalValue, setTotalValue] = useState('')
  const [itemAutocompleteClicked, setItemAutocompleteClicked] = useState('')
  const [isClearFields, setClearFields] = useState(false)
  const [qtdeValue, setQtdeValue] = useState<string>('')
  const { sum } = useTotalSum()
  const { apiAdmin } = useAdmin()
  const [optionLaudoTech, setOptionLaudoTech] = useState<AutocompleteOptions[]>(
    [] as AutocompleteOptions[],
  )
  const [valueLaudoTech, setValueLaudoTech] = useState<AutocompleteOptions>(
    {} as AutocompleteOptions,
  )
  const makeRequest = useSelector((state: IStore) => state.layout.makeRequest)
  const [clickedValueService, setClickedValueService] = useLocalStorage('os-clickedValueService', {} as AutocompleteOptions)

  const addValueArrayLaudoTech = (itemPiece: ItemServices) => {
    // setItemServices((previousState) => [
    //   ...previousState.filter(
    //     (item: ItemServices) => item.id !== valueLaudoTech.value,
    //   ),
    //   itemPiece,
    // ])
  }

  const calcPrice = (qtde: string) => {
    if (qtde?.trim() !== '') {
      const resultCalc = Number(qtde) * Number(services?.value)
      setTotalValue(formatPrice(resultCalc))
      setMsgError('')
      sum(resultCalc)
      addValueArrayLaudoTech({
        description: valueLaudoTech.label,
        id: String(valueLaudoTech.value),
        qtde: Number(qtde),
        total: resultCalc,
        unit: services?.value,
      })
    } else {
      setTotalValue(formatPrice(services?.value))
      setMsgError('Obrigatório!')
      sum(services?.value)
    }
  }

  const handleRemoveItem = () => {
    setItemServices((previousState) => [
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

  const services = useSelector(
    (state: IStore) =>
      state?.service?.services?.filter(
        (service) => service?._id === valueLaudoTech?.value,
      )[0],
  )

  const clearValues = () => {
    setQtdeValue('')
    setValueUnit('')
    setTotalValue('')
  }

  // useEffect(() => {
  //   clearValues()
  //   setValueLaudoTech({ label: '', value: '' })
  //   setClickedValue({ label: '', value: '' })
  //   setClickedValueService({ label: '', value: '' })
  //   setItemServices([])
  // }, [isClearFields])


  const setValueInFields = () => {
    setValueUnit(formatPrice(services?.value))
    setQtdeValue('1')
    calcPrice('1')
    addValueArrayLaudoTech({
      description: valueLaudoTech.label,
      id: String(valueLaudoTech.value),
      qtde: 1,
      total: Number(services?.value),
      unit: services?.value,
    })
    setMsgErrorAutoComplete('')
  }

  useEffect(() => {
    if (services?.value) {
      // setItemServices((previousState) => {
      //   const result = previousState.filter(
      //     (item: ItemServices) => item.description === valueLaudoTech.label,
      //   )
      //   handleRemoveItem()
      //   if (!result.length) {
      //     setValueInFields()
      //   } else {
      //     setMsgErrorAutoComplete(
      //       'Esse serviço já foi adicionado, escolha outro.',
      //     )
      //     clearValues()
      //   }
      //   return previousState
      // })
    } else {
      setMsgErrorAutoComplete('')
      clearValues()
      setIdRowWarning('')
      //  handleRemoveItem()
    }
  }, [valueLaudoTech])

  useEffect(() => {
    if (services) {
      const idServiceCurrent = valueLaudoTech.value
      const idStateUpdated = services._id
      if (idServiceCurrent === idStateUpdated) {
        if (valueLaudoTech.label.trim() !== services.description.trim()) {
          setValueLaudoTech({ label: services.description, value: idStateUpdated })
        } else {
          setValueInFields()
        }
      }
    }
  }, [services])

  useEffect(() => {
    //let cancel: any

    const loadLaudoTech = async () => {
      try {
        const response = await apiAdmin.get(`services`, {
          params: {
            description:
              (valueLaudoTech.value === 0 && valueLaudoTech.label) || undefined,
          },
          // cancelToken: new axios.CancelToken((c) => (cancel = c)),
        })

        const dataMapped = response?.data?.map((val: ServiceT) => {
          const valueFormated = formatPrice(val.value)
          return {
            value: val._id,
            label: `[${valueFormated}] - ${val.description}`,
          }
        })

        setOptionLaudoTech(dataMapped)
        dispatch({
          type: SERVICE_SEE_ALL,
          payload: await fromApi(response),
        })
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message)
        }
      }
    }
    loadLaudoTech()

    //return () => cancel && cancel()
  }, [valueLaudoTech, makeRequest])

  const onFormatterPrice = (value: string) => {
    const { formated } = formatInputPrice(value)
    setValueUnit(formated)
  }

  const onHandleSelectedAutocomplete = ({ target }) => {
    if (!msgErrorAutoComplete) {
      setItemAutocompleteClicked(target.defaultValue)
    }
  }

  const getServiceById = async (id: string | number) => {
    try {
      const { data } = await apiAdmin.get(`services/${id}`)
      return fromApiService(data)
    } catch (error) {
      exceptionHandle(error)
    }
  }

  const onHandleEditService = async () => {
    setIdRowWarning('')
    const id = clickedValueService?.value
    const dataService = await getServiceById(id)
    showMessage(
      EditService,
      {
        isNewServiceByOS: true,
        dataService,
        setClearFields
      },
      true,
    )
  }

  const checkIfAlreayExistsServiceinList = (id: string | number, qtde: number) => {
    setIdRowWarning('')
    if (itemServices?.length) {
      if (itemServices?.length === 8) {
        toast.warning('A quantidade de serviço permitido é 8.')
        return false
      }
      const resultItemServices = itemServices.find((item) => item.id === id)
      if (resultItemServices) {
        if (resultItemServices.qtde !== qtde) {
          setIdRowWarning(String(id))
          toast.warning(`Já existe um serviço adicionado com a quantidade diferente, remova o serviço da lista abaixo para adicionar ou informe a mesma quantidade.`)
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

  const openModalServiceAdd = () => {
    if (clickedValue) {
      if (!!Object.keys(clickedValue).length) {
        if (services?.laudos.length > 1) {
          setLaudos((previousState) => {
            showMessage(
              LaudoConfirmation,
              {
                clickedValue,
                setLaudosList,
                laudosList,
                addService,
                setLaudos
              },
              false,
            )
            // if (checkLengthLaudos(previousState)) {}
            return previousState
          })
        } else if (services?.laudos.length === 1) {
          setLaudos((laudos) => [
            ...laudos,
            {
              checked: true,
              description: String(services.laudos[0]),
              service: clickedValue.label,
            },
          ])
          addService()
        }
      }
    }
  }

  const addService = () => {

    setIsFirstLoadingPage(false)

    const { clean: totalValueClean } = formatInputPrice(totalValue)
    const { clean: valueUnitClean } = formatInputPrice(valueUnit)

    if (!valueLaudoTech?.label) {
      toast.warning('Primeiro selecione o serviço para depois adicionar.')
      return
    }

    if (!checkIfAlreayExistsServiceinList(valueLaudoTech?.value, Number(qtdeValue))) return

    setItemServices((previousState) => [
      ...previousState.filter((item) => item.id !== valueLaudoTech?.value),
      {
        id: valueLaudoTech?.value,
        description: valueLaudoTech?.label,
        qtde: Number(qtdeValue),
        unit: valueUnitClean,
        total: totalValueClean
      }
    ])

    setMsgErrorAutoComplete('')
    clearValues()
    setValueLaudoTech({ label: '', value: '' })
    setClickedValue({ label: '', value: '' })
    setClickedValueService({ label: '', value: '' })
    setIdRowWarning('')
  }

  return (
    <Row columns="5fr 0.1fr 1fr 1fr 1fr" gap={10} marginTop="5px">
      <Autocomplete
        value={valueLaudoTech}
        setValue={setValueLaudoTech}
        options={optionLaudoTech}
        setOptions={setOptionLaudoTech}
        setClickedValue={(value) => {
          setClickedValue(value)
          setClickedValueService(value)
        }}
        hasError={!!msgErrorAutoComplete}
        error={msgErrorAutoComplete}
        onSelect={onHandleSelectedAutocomplete}
        isHasEdit={!!clickedValueService?.label}
        onHandleClickButtonLabelEdit={onHandleEditService}
      />
      <InputText
        value={qtdeValue}
        mask={''}
        disabled={
          services?.value === undefined || !!msgErrorAutoComplete ? true : false
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
          onClick={openModalServiceAdd}
        />
      </Row>
    </Row>
  )
}
