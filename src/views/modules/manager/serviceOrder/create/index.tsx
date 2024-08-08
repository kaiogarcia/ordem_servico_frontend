/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { yupResolver } from '@hookform/resolvers/yup'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { Checkbox, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup } from '@mui/material'
import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  Autocomplete,
  AutocompleteOptions
} from 'src/components/Form/Autocomplete'
import Button from 'src/components/Form/Button'
import InputMask from 'src/components/Form/InputMask'
import { Select } from 'src/components/Widgets/Select'
import { toast } from 'src/components/Widgets/Toastify'
import { exceptionHandle } from 'src/helpers/exceptions'
import { formatInputPrice, formatPrice } from 'src/helpers/formatPrice'
import { useModal } from 'src/hooks/useModal'
import { MANAGER_SERVICE_ORDER } from 'src/layouts/typePath'
import { useAdmin } from 'src/services/useAdmin'
import { ClientT, IStore, ServiceOrderT } from 'src/store/Types'
import { LAYOUT_IS_MODIFIED_FIELDS, SERVICE_FILTER, SERVICE_ORDER_CREATE } from 'src/store/actions'
import { Row } from 'src/styles'
import CreateClient from 'src/views/modules/administration/clients/create'
import EditClient from 'src/views/modules/administration/clients/edit'
import CreateEquipament from 'src/views/modules/administration/equipaments/create'
import useLocalStorage from 'use-local-storage'
import { schemaServiceOrder } from '../schemaValidation'
import { fromApiSerialNumber, toApi } from './adapters'
import { fromApiClient } from './adapters/fromApi'
import InputText from './components/InputCurrency'
import { useAddLocalStorage } from './hooks/useAddLocalStorage'
import { useTotalSum } from './hooks/useTotalSum'
import { LaunchFinancial } from './messages/LaunchFinancial'
import {
  ButtonContainer,
  Container,
  Form,
  GroupDiscount,
  Total
} from './style'
import PiecesOS from './tables/piecesOS'
import ServiceOS from './tables/serviceOS'
import { Laudo } from './tables/type'
import { ItemPieces, ItemServices, OSData } from './type'

type TypeDiscount = 'porcent' | 'real'

const CreateOrderService: React.FC = () => {
  const dispatch = useDispatch()
  const [typeDiscount, setTypeDiscount] = useState<TypeDiscount>('porcent')
  const [warranty, setWarranty] = useState(false)
  const { apiAdmin } = useAdmin()

  const equipaments = useSelector(
    (state: IStore) => state.equipament?.equipaments,
  )

  const { resetTotal } = useTotalSum()
  const { showMessage, showSimple } = useModal()

  const { control, handleSubmit, formState, setValue, watch } =
    useForm<ServiceOrderT>({
      shouldUnregister: false,
      resolver: yupResolver(schemaServiceOrder),
    })

  const [cable, setCable] = useLocalStorage('cable', '')
  const [charger, setCharger] = useLocalStorage('charger', '')
  const [breaked, setBreaked] = useLocalStorage('breaked', '')
  const [detail, setDetail] = useLocalStorage('detail', '')

  const typeDocument = watch('typeDocument')

  useAddLocalStorage({
    watch,
    setValue,
    setCable,
    setCharger,
    setBreaked,
    setDetail,
  })

  useEffect(() => {
    setValue('cable', cable)
    setValue('charger', charger)
    setValue('breaked', breaked)
    setValue('detail', detail)
    return () => {
      window.localStorage.removeItem('client')
      window.localStorage.removeItem('clickedClientName')
    }
  }, [])

  const [optionClient, setOptionClient] = useState<AutocompleteOptions[]>(
    [] as AutocompleteOptions[],
  )
  const [clients, setClients] = useState<ClientT[]>([] as ClientT[])
  const [checkBoxEnableEquipaments, setCheckBoxEnableEquipaments] = useState(true)
  const [checkBoxEnableInfoEquipaments, setCheckBoxEnableInfoEquipaments] = useState(true)
  const [client, setClient] = useLocalStorage<AutocompleteOptions>('client',
    {} as AutocompleteOptions,
  )
  const [discount, setDiscount] = useState('0')
  const [equipamentsNameOptions, setEquipamentsNameOptions] = useState<
    AutocompleteOptions[]
  >([] as AutocompleteOptions[])
  const [brandOptions, setBrandOptions] = useState<AutocompleteOptions[]>(
    [] as AutocompleteOptions[],
  )
  const [modelOptions, setModelOptions] = useState<AutocompleteOptions[]>(
    [] as AutocompleteOptions[],
  )
  const [serialNumberOptions, setSerialNumberOptions] = useState<
    AutocompleteOptions[]
  >([] as AutocompleteOptions[])

  const [equipamentName, setEquipamentName] = useState(
    {} as AutocompleteOptions,
  )
  const [brand, setBrand] = useState({} as AutocompleteOptions)
  const [model, setModel] = useState({} as AutocompleteOptions)
  const [serialNumber, setSerialNumber] = useState({} as AutocompleteOptions)

  const [manpower, setManpower] = useState('0.00')
  const [isDisableManPower, setIsDisableManPower] = useState(false)
  const [total, setTotal] = useState('0.00')
  const [totalLaudoTech, setTotalLaudoTech] = useState(0)
  const [laudos, setLaudos] = React.useState<Laudo[]>([] as Laudo[])
  const [totalPieces, setTotalPieces] = useState(0)
  const [itemPieces, setItemPieces] = useState<ItemPieces[]>([] as ItemPieces[])
  const [itemServices, setItemServices] = useState<ItemServices[]>(
    [] as ItemServices[],
  )

  const [clickedClientName, setClickedClientName] = useLocalStorage('clickedClientName',
    {} as AutocompleteOptions,
  )
  const [clickedEquipament, setClickedEquipament] = useState(
    {} as AutocompleteOptions,
  )
  const [clickedBrand, setClickedBrand] = useState({} as AutocompleteOptions)
  const [clickedModel, setClickedModel] = useState({} as AutocompleteOptions)
  const [clickedSerialNumber, setClickedSerialNumber] = useState(
    {} as AutocompleteOptions,
  )
  const [osNumber, setOsNumber] = useLocalStorage('osNumber', '')
  const [validateErrorMessageClientName, setValidateErrorMessageClientName] =
    useState('')
  const [validateErrorMessageEquipament, setValidateErrorMessageEquipament] =
    useState('')
  const [validateErrorMessageBrand, setValidateErrorMessageBrand] = useState('')
  const [validateErrorMessageModel, setValidateErrorMessageModel] = useState('')
  const [
    validateErrorMessageSerialNumber,
    setValidateErrorMessageSerialNumber,
  ] = useState('')
  const [messageErrorTotal, setMessageErrorTotal] = useState('')
  const [loading, setLoading] = useState(false)

  const getDateCurrent = () => {
    const dataAtual = moment()
    const formato = 'DD/MM/YYYY'
    return dataAtual.format(formato)
  }

  const makeRequest = useSelector((state: IStore) => state.layout.makeRequest)
  const clientsGlobalState = useSelector(
    (state: IStore) =>
      state.client.clients.filter(
        (item) => item._id === client?.value,
      )[0],
  )

  const history = useHistory()

  useLayoutEffect(() => {
    scroll(0, 0)
    dispatch({
      type: SERVICE_ORDER_CREATE,
      payload: {
        laudos: [
          {
            checked: false,
            description: '',
            service: '',
          },
        ],
      },
    })
  }, [])

  useEffect(() => {
    if (clickedClientName) {
      setValidateErrorMessageClientName('')
    }
  }, [clickedClientName])

  useEffect(() => {
    if (clickedEquipament) {
      setValidateErrorMessageEquipament('')
    }
  }, [clickedEquipament])

  useEffect(() => {
    if (clickedBrand) {
      setValidateErrorMessageBrand('')
    }
  }, [clickedBrand])

  useEffect(() => {
    if (clickedModel) {
      setValidateErrorMessageModel('')
    }
  }, [clickedModel])

  useEffect(() => {
    if (clickedSerialNumber) {
      setValidateErrorMessageSerialNumber('')
    }
  }, [clickedSerialNumber])

  const sumTotal = (pieces: ItemPieces[]) => {
    return pieces.reduce((acc, piece) => acc + piece.total, 0)
  }

  const removeDuplicates = (array: AutocompleteOptions[]) => {
    return array.reduce((acc: AutocompleteOptions[], option) => {
      const isDuplicate = acc.some((item) => item.label === option.label);
      if (!isDuplicate) {
        acc.push(option);
      }
      return acc;
    }, []);
  };

  const getEquipaments = () => {
    const resultEquipamentsName = equipaments.map((item) => ({
      label: item.equipamentName,
      value: item.equipamentName,
    }))
    const resultBrand = equipaments.map((item) => ({
      label: item.brand,
      value: item.brand,
    }))
    const model = equipaments.map((item) => ({
      label: item.model,
      value: item.model,
    }))
    const resultSerialNumber = fromApiSerialNumber(equipaments)
    setEquipamentsNameOptions(removeDuplicates(resultEquipamentsName))
    setBrandOptions(removeDuplicates(resultBrand))
    setModelOptions(removeDuplicates(model))
    setSerialNumberOptions(removeDuplicates(resultSerialNumber))
  }

  useEffect(() => {
    if (itemPieces.length) {
      setTotalPieces(sumTotal(itemPieces))
    } else {
      setTotal('R$ 0,00')
      setTotalPieces(0)
    }
  }, [itemPieces])

  useEffect(() => {
    if (itemServices.length) {
      setTotalLaudoTech(sumTotal(itemServices))
    } else {
      setTotal('R$ 0,00')
      setTotalLaudoTech(0)
    }
  }, [itemServices])

  useEffect(() => {
    let { clean: totalManPower } = formatInputPrice(manpower)
    if (!totalManPower) {
      totalManPower = 0
    }
    setTotal(formatPrice(totalPieces + totalLaudoTech + totalManPower))
  }, [totalPieces, totalLaudoTech])

  useEffect(() => {
    if (total) {
      const { clean } = formatInputPrice(total)
      if (clean > 0) {
        setIsDisableManPower(false)
      } else {
        setIsDisableManPower(true)
      }
    }
    setMessageErrorTotal('')
  }, [total])

  useEffect(() => {
    if (Object.values(formState?.errors).some((item) => item)) {
      scroll(0, 0)
    }
  }, [formState?.errors])

  const getNextOsNumber = (data: { osNumber: string }[]): string => {
    const highestNumber = data.reduce((prev, current) => {
      const currentNumber = parseInt(current.osNumber)
      return currentNumber > prev ? currentNumber : prev
    }, 0)
    return highestNumber ? (highestNumber + 1).toString() : '883'
  }

  const getOSNumber = async () => {
    try {
      const { data } = await apiAdmin.get(`orderServices`)
      setOsNumber(getNextOsNumber(data))
    } catch (error) {
      console.log(error)
      exceptionHandle(error)
    }
  }

  useEffect(() => {
    getOSNumber()
    getEquipaments()
    resetTotal()
    setTotal('R$ 0,00')
    scroll(0, 0)
    return () => {
      window.localStorage.removeItem('os-clickedValueService')
      window.localStorage.removeItem('os-clickedValuePiece')
    }
  }, [])

  // scroll(0, 0)

  const resetAllField = () => {
    dispatch({
      type: LAYOUT_IS_MODIFIED_FIELDS,
      payload: {
        fields: {},
        url: ''
      },
    })
  }

  const calcDiscount = (): string => {
    let { clean: totalManPower } = formatInputPrice(manpower)
    // let totalDiscount = Number(discount.replace('%', ''))
    // if (!discount) {
    //   totalDiscount = 0
    // }
    let totalValue = totalPieces + totalLaudoTech + totalManPower
    // const valorDesconto = (totalValue * totalDiscount) / 100
    //return formatPrice(Number(valorDesconto.toFixed(2)))
    return formatPrice(totalValue)
  }

  const saveOrcamento = async (dataOS: OSData) => {
    try {
      await apiAdmin.post(`orderServices`, dataOS)
      dispatch({
        type: SERVICE_FILTER,
        payload: {},
      })
      toast.success('Orçamento cadastrado com sucesso.')
      history.push(MANAGER_SERVICE_ORDER)
    } catch (error) {
      toast.error('Houve um erro ao tentar salvar o Orçamento.')
    }
  }

  const onSubmit = async (data: ServiceOrderT & OSData) => {
    const { clean: totalCleanValue } = formatInputPrice(total)
    const clickedValueService = JSON.parse(window.localStorage.getItem('os-clickedValueService'))
    if (clickedValueService?.value) {
      toast.error('Existe um serviço não adicionado.')
      scroll(0, 0)
      return
    }
    const clickedValuePiece = JSON.parse(window.localStorage.getItem('os-clickedValuePiece'))
    if (clickedValuePiece?.value) {
      toast.error('Existe uma peça não adicionada.')
      scroll(0, 0)
      return
    }
    if (!clickedClientName?.label) {
      setValidateErrorMessageClientName('Selecione o cliente')
      scroll(0, 0)
      return
    }
    if (!clickedEquipament?.label && checkBoxEnableEquipaments) {
      setValidateErrorMessageEquipament('Selecione o equipamento')
      scroll(0, 0)
      return
    }
    if (!clickedBrand?.label && checkBoxEnableEquipaments) {
      setValidateErrorMessageBrand('Selecione a marca')
      scroll(0, 0)
      return
    }
    if (!clickedModel?.label && checkBoxEnableEquipaments) {
      setValidateErrorMessageModel('Selecione o modelo')
      scroll(0, 0)
      return
    }
    if (!clickedSerialNumber?.label && checkBoxEnableEquipaments) {
      setValidateErrorMessageSerialNumber('Selecione o número de série')
      scroll(0, 0)
      return
    }

    if (totalCleanValue === 0 || totalCleanValue === undefined) {
      setMessageErrorTotal('Total obrigatório!')
      return
    }

    if (laudos?.length > 9) {
      showSimple.error('A quantidade de laudos não pode ser maior do que 9')
      return
    }

    setValidateErrorMessageClientName('')
    setMessageErrorTotal('')

    const OSData = {
      ...data,
      client: clients.filter(
        (clientItem) => clientItem._id === clickedClientName.value,
      )[0],
      typeDocument: data.typeDocument,
      status: 'PENDENTE',
      itemServices,
      laudos,
      itemPieces,
      manpower: manpower === '' ? 'R$ 0,00' : manpower,
      equipament: checkBoxEnableEquipaments ? equipamentName.label : '-',
      brand: checkBoxEnableEquipaments ? brand.label : '-',
      model: checkBoxEnableEquipaments ? model.label : '-',
      serialNumber: checkBoxEnableEquipaments ? serialNumber.label : '-',
      cable: checkBoxEnableInfoEquipaments ? data.cable : '-',
      charger: checkBoxEnableInfoEquipaments ? data.charger : '-',
      breaked: checkBoxEnableInfoEquipaments ? data.breaked : '-',
      detail: checkBoxEnableInfoEquipaments ? data.detail : '-',
      osNumber,
      discount,
      total,
      subTotal: calcDiscount(),
    }

    try {
      setLoading(true)
      const resultToApi = toApi(OSData, osNumber)
      if (data.typeDocument === 'ORCAMENTO') {
        await saveOrcamento(resultToApi)
      } else {
        showMessage(LaunchFinancial, {
          data: resultToApi,
          history,
        })
      }
    } catch (error) {
      console.log(error)
      exceptionHandle(error)
    } finally {
      setLoading(false)
      resetAllField()
    }
  }

  useEffect(() => {
    let cancel: any

    const loadClient = async () => {
      try {
        const { data } = await apiAdmin.get(`clients`, {
          params: {
            name: client.label,
          },

          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        })

        const dataMapped = data?.map((val: ClientT) => ({
          value: val._id,
          label: val.name,
        }))

        setOptionClient(dataMapped)
        setClients(data)
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message)
        }
      }
    }

    loadClient()

    return () => cancel && cancel()
  }, [client, makeRequest])

  useEffect(() => {
    if (!equipamentName.label?.toUpperCase()) {
      setEquipamentsNameOptions(
        removeDuplicates(equipaments.map((item) => ({
          label: item.equipamentName,
          value: item.equipamentName,
        }))),
      )
    } else {
      const result = equipaments.filter((item) =>
        item.equipamentName.includes(equipamentName.label?.toUpperCase()),
      )
      setEquipamentsNameOptions(
        removeDuplicates(result.map((item) => ({
          label: item.equipamentName,
          value: item.equipamentName,
        }))),
      )
    }
    if (!brand.label?.toUpperCase()) {
      setBrandOptions(
        removeDuplicates(equipaments.map((item) => ({
          label: item.brand,
          value: item.brand,
        }))),
      )
    } else {
      const result = equipaments.filter((item) =>
        item.brand.includes(brand.label?.toUpperCase()),
      )
      setBrandOptions(
        removeDuplicates(result.map((item) => ({
          label: item.brand,
          value: item.brand,
        }))),
      )
    }
    if (!model.label?.toUpperCase()) {
      setModelOptions(
        equipaments.map((item) => ({
          label: item.model,
          value: item.model,
        })),
      )
    } else {
      const result = equipaments.filter((item) =>
        item.model.includes(model.label?.toUpperCase()),
      )
      setModelOptions(
        result.map((item) => ({
          label: item.model,
          value: item.model,
        })),
      )
    }
    if (!serialNumber.label?.toUpperCase()) {
      // setSerialNumberOptions(
      //   equipaments.map((item) => ({
      //     label: item.serialNumber,
      //     value: item.serialNumber,
      //   })),
      // )
      setSerialNumberOptions(fromApiSerialNumber(equipaments))
    } else {
      const result = fromApiSerialNumber(equipaments).filter((item) =>
        item.label.includes(serialNumber.label?.toUpperCase()),
      )
      setSerialNumberOptions(
        result.map((item) => ({
          label: item.label,
          value: item.value,
        })),
      )
    }
  }, [equipamentName, brand, model, serialNumber, makeRequest])

  const handleKeyDownManPower = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace') {
      const { clean: manPowerCleanValue } = formatInputPrice(manpower)
      const { clean: totalCleanValue } = formatInputPrice(total)
      if (manPowerCleanValue !== undefined) {
        setTotal(formatPrice(totalCleanValue - manPowerCleanValue))
      }
    }
    if (event.key === 'Delete') {
      setTotal(formatPrice(totalPieces + totalLaudoTech))
      setManpower('')
    }
  }
  const handleKeyDownDiscount = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace') {
      setDiscount((previousState) => previousState.replace('%', '').replace('R$', ''))
      let { clean: totalManPower } = formatInputPrice(manpower)
      if (!totalManPower) {
        totalManPower = 0
      }
      setTotal(formatPrice(totalPieces + totalLaudoTech + totalManPower))
    }
    if (event.key === 'Delete') {
      let { clean: totalManPower } = formatInputPrice(manpower)
      if (!totalManPower) {
        totalManPower = 0
      }
      setTotal(formatPrice(totalPieces + totalLaudoTech + totalManPower))
      setDiscount('')
    }
  }

  const calculateDiscount = () => {
    let { clean: totalManPower } = formatInputPrice(manpower)
    if (!totalManPower) {
      totalManPower = 0
    }
    if (typeDiscount === 'porcent') {
      let totalDiscount = String(discount).replace('R$', '').replace('%', '').replace(',', '.').trim()
      setDiscount(`${totalDiscount}%`)
      let total = totalPieces + totalLaudoTech + totalManPower
      total = total * (1 - Number(totalDiscount) / 100)
      setTotal(() => formatPrice(total))
    } else {
      let totalDiscount = String(discount).replace('R$', '').replace('%', '').replace(',', '.').trim()
      setDiscount(`R$ ${totalDiscount}`)
      let total = totalPieces + totalLaudoTech + totalManPower
      total = total - Number(totalDiscount)
      setTotal(() => formatPrice(total))
    }
  }

  const onKeyUpManpower = () => {
    const { formated, clean } = formatInputPrice(manpower)
    if (clean) {
      setManpower(formated)
      if (discount) {
        calculateDiscount()
      } else {
        setTotal(() => formatPrice(totalPieces + totalLaudoTech + clean))
      }
    }
  }

  const onKeyUpDiscount = () => {
    calculateDiscount()
  }

  const onHandleAddNewClient = () => {
    showMessage(
      CreateClient,
      {
        isNewServiceByOS: true,
      },
      true,
    )
  }

  const getClientById = async () => {
    const clientId = clickedClientName.value
    try {
      const { data } = await apiAdmin.get(`clients/${clientId}`)
      return fromApiClient(data)
    } catch (error) {
      exceptionHandle(error)
    }

  }

  const onHandleEditClient = async () => {
    const clientData = await getClientById()
    showMessage(
      EditClient,
      {
        isNewServiceByOS: true,
        clientData
      },
      true,
    )
  }

  const onHandleAddNewEquipament = () => {
    showMessage(
      CreateEquipament,
      {
        isNewServiceByOS: true,
      },
      true,
    )
  }

  const handleChangeCheckBoxEnableEquipaments = (event: any) => {
    setCheckBoxEnableEquipaments(event.target.checked)
  }
  const handleChangeCheckBoxEnableInfoEquipaments = (event: any) => {
    setCheckBoxEnableInfoEquipaments(event.target.checked)
  }

  const back = () => {
    history.push(MANAGER_SERVICE_ORDER)
    resetAllField()
  }

  const onHandleChangeTypeDiscount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypeDiscount((event.target as HTMLInputElement).value as TypeDiscount);
    setDiscount('')
    let { clean: totalManPower } = formatInputPrice(manpower)
    let total = totalPieces + totalLaudoTech + totalManPower
    total = total - 0
    setTotal(() => formatPrice(total))
  };

  const onHandleChangeWarranty = (event: any) => {
    setWarranty(event.target.checked);
    if (!warranty) {
      setManpower('Garantia')
    } else {
      setManpower('0.00')
    }
  };

  React.useEffect(() => {
    if (!checkBoxEnableEquipaments) {
      setEquipamentName({ label: '', value: '' })
      setBrand({ label: '', value: '' })
      setModel({ label: '', value: '' })
      setSerialNumber({ label: '', value: '' })
      setClickedEquipament({ label: '', value: '' })
      setClickedBrand({ label: '', value: '' })
      setClickedModel({ label: '', value: '' })
      setClickedSerialNumber({ label: '', value: '' })
    }
  }, [checkBoxEnableEquipaments])

  React.useEffect(() => {
    dispatch({
      type: LAYOUT_IS_MODIFIED_FIELDS,
      payload: {
        fields: {
          client: client.label,
          equipamentName: equipamentName.label,
          brand: brand.label,
          model: model.label,
          serialNumber: serialNumber.label,
          typeDocument
        },
        url: window.location.pathname
      },
    })
  }, [client.label, equipamentName.label, brand.label, model.label, serialNumber.label, typeDocument])


  React.useEffect(() => {
    if (clientsGlobalState) {
      const idServiceCurrent = client.value
      const idStateUpdated = clientsGlobalState._id
      if (idServiceCurrent === idStateUpdated) {
        if (client.label.trim() !== clientsGlobalState.name.trim()) {
          setClient({ label: clientsGlobalState.name, value: idStateUpdated })
        } else {
          //setValueInFields()
        }
      }
    }
  }, [clientsGlobalState])

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Row columns="1fr 2fr 6fr 1fr" gap={10}>
          <InputText
            type="text"
            label="Nº OS"
            isCurrencyNumberOnly
            value={osNumber}
            disabled
          />
          <Controller
            name="typeDocument"
            control={control}
            defaultValue={''}
            render={({ field, formState }) => (
              <Select
                {...field}
                labelDefaultOption="Selecione"
                label="Tipo Documento"
                hasError={!!formState.errors.typeDocument?.message}
                msgError={formState.errors.typeDocument?.message}
                options={[
                  { label: 'ORÇAMENTO', value: 'ORCAMENTO' },
                  { label: 'ORDEM DE SERVIÇO', value: 'ORDEM_DE_SERVICO' },
                ]}
              />
            )}
          />
          <Autocomplete
            label="Cliente"
            value={client}
            setValue={setClient}
            options={optionClient}
            setOptions={setOptionClient}
            setClickedValue={setClickedClientName}
            hasError={!!validateErrorMessageClientName}
            error={validateErrorMessageClientName}
            isUseButton
            isHasEdit={!!clickedClientName?.value}
            iconButtonLabel={<AddCircleOutlineIcon />}
            tooltipMessageButtonLabel="Clique aqui para adicionar um novo cliente."
            onHandleClickButtonLabel={onHandleAddNewClient}
            onHandleClickButtonLabelEdit={onHandleEditClient}
          />
          <Controller
            name="dateOS"
            control={control}
            defaultValue={getDateCurrent()}
            render={({ field, fieldState }) => (
              <InputMask
                label={'Data'}
                field={field}
                fieldState={fieldState}
                mask='99/99/9999'
                value={field.value}
                setValue={(value) => setValue('dateOS', value)}
              />
            )}
          />
        </Row>
        <Row marginTop="10px">
          <FormGroup>
            <FormControlLabel
              control={<Checkbox />}
              checked={checkBoxEnableEquipaments}
              onChange={(event) => handleChangeCheckBoxEnableEquipaments(event)}
              label={'Mostrar Informações do Equipamento'}
              value={checkBoxEnableEquipaments}
            />
          </FormGroup>
        </Row>
        <Row columns="repeat(4, 1fr)" marginTop="10px" gap={10}>
          <Autocomplete
            label="Equipamento"
            value={equipamentName}
            setValue={setEquipamentName}
            options={equipamentsNameOptions}
            setOptions={setEquipamentsNameOptions}
            setClickedValue={setClickedEquipament}
            hasError={!!validateErrorMessageEquipament}
            error={validateErrorMessageEquipament}
            isUseButton
            iconButtonLabel={<AddCircleOutlineIcon />}
            tooltipMessageButtonLabel="Clique aqui para adicionar um novo Equipamento."
            onHandleClickButtonLabel={onHandleAddNewEquipament}
            disabled={!checkBoxEnableEquipaments}
          />
          <Autocomplete
            label="Marca"
            value={brand}
            setValue={setBrand}
            options={brandOptions}
            setOptions={setBrandOptions}
            setClickedValue={setClickedBrand}
            hasError={!!validateErrorMessageBrand}
            error={validateErrorMessageBrand}
            disabled={!checkBoxEnableEquipaments}
          />
          <Autocomplete
            label="Modelo"
            value={model}
            setValue={setModel}
            options={modelOptions}
            setOptions={setModelOptions}
            setClickedValue={setClickedModel}
            hasError={!!validateErrorMessageModel}
            error={validateErrorMessageModel}
            disabled={!checkBoxEnableEquipaments}
          />
          <Autocomplete
            label="Nº Série"
            value={serialNumber}
            setValue={setSerialNumber}
            options={serialNumberOptions}
            setOptions={setSerialNumberOptions}
            setClickedValue={setClickedSerialNumber}
            hasError={!!validateErrorMessageSerialNumber}
            error={validateErrorMessageSerialNumber}
            disabled={!checkBoxEnableEquipaments}
          />
        </Row>
        <Row marginTop="10px">
          <FormGroup>
            <FormControlLabel
              control={<Checkbox />}
              checked={checkBoxEnableInfoEquipaments}
              onChange={(event) => handleChangeCheckBoxEnableInfoEquipaments(event)}
              label={'Mostrar Observações do Equipamento'}
              value={checkBoxEnableInfoEquipaments}
            />
          </FormGroup>
        </Row>
        <Row columns="repeat(4, 1fr)" marginTop="10px" gap={10}>
          <Controller
            name="cable"
            control={control}
            defaultValue={''}
            render={({ field, formState }) => (
              <Select
                {...field}
                labelDefaultOption="Selecione"
                label="Cabo"
                hasError={!!formState.errors.cable?.message}
                msgError={formState.errors.cable?.message}
                disabled={!checkBoxEnableInfoEquipaments}
                options={[
                  { label: 'SIM', value: 'SIM' },
                  { label: 'NAO', value: 'NAO' },
                ]}
              />
            )}
          />
          <Controller
            name="charger"
            control={control}
            defaultValue={''}
            render={({ field, formState }) => (
              <Select
                {...field}
                labelDefaultOption="Selecione"
                label="Carregador"
                hasError={!!formState.errors.charger?.message}
                msgError={formState.errors.charger?.message}
                disabled={!checkBoxEnableInfoEquipaments}
                options={[
                  { label: 'SIM', value: 'SIM' },
                  { label: 'NAO', value: 'NAO' },
                ]}
              />
            )}
          />
          <Controller
            name="breaked"
            control={control}
            defaultValue={''}
            render={({ field, formState }) => (
              <Select
                {...field}
                labelDefaultOption="Selecione"
                label="Quebrado"
                hasError={!!formState.errors.breaked?.message}
                msgError={formState.errors.breaked?.message}
                disabled={!checkBoxEnableInfoEquipaments}
                options={[
                  { label: 'SIM', value: 'SIM' },
                  { label: 'NAO', value: 'NAO' },
                ]}
              />
            )}
          />
          <Controller
            name="detail"
            control={control}
            defaultValue={''}
            render={({ field, formState }) => (
              <Select
                {...field}
                labelDefaultOption="Selecione"
                label="Detalhes"
                hasError={!!formState.errors.detail?.message}
                msgError={formState.errors.detail?.message}
                disabled={!checkBoxEnableInfoEquipaments}
                options={[
                  { label: 'SIM', value: 'SIM' },
                  { label: 'NAO', value: 'NAO' },
                ]}
              />
            )}
          />
        </Row>
        <Row columns="1fr" gap={5} marginTop="10px">
          <ServiceOS
            setItemServices={setItemServices}
            itemServices={itemServices}
            laudos={laudos}
            setLaudos={setLaudos}
          />
          {/* <LaudoTechnicalTable
            setItemServices={setItemServices}
            itemServices={itemServices}
            laudos={laudos}
            setLaudos={setLaudos}
          /> */}
          <PiecesOS setItemPieces={setItemPieces} itemPieces={itemPieces} />
          {/* <PiecesTable setItemPieces={setItemPieces} itemPieces={itemPieces} /> */}
        </Row>
        <Row columns="1fr 1fr 1fr" marginTop="10px">
          <div>
            <GroupDiscount>
              {/* <FormControl >
                <RadioGroup
                  row
                  value={warranty}
                  onChange={onHandleChangeWarranty}
                >
                  <FormControlLabel value="warranty" control={<Radio />} label="Garantia" />
                </RadioGroup>
              </FormControl> */}
              <FormGroup style={{ marginTop: '25px' }}>
                <FormControlLabel
                  control={<Checkbox />}
                  checked={warranty}
                  onChange={onHandleChangeWarranty}
                  label={'Garantia'}
                  value={warranty}
                />
              </FormGroup>
            </GroupDiscount>
            <InputText
              type="text"
              label="Mão de Obra"
              mask={''}
              value={manpower}
              setValue={setManpower}
              onChange={(event) => setManpower && setManpower(event.target.value)}
              autoComplete="off"
              onKeyUp={onKeyUpManpower}
              onKeyDown={handleKeyDownManPower}
              disabled={isDisableManPower}
            />
          </div>
          <GroupDiscount>
            <div>
              <FormControl style={{ marginTop: '25px' }}>
                <RadioGroup
                  row
                  value={typeDiscount}
                  onChange={onHandleChangeTypeDiscount}
                >
                  <FormControlLabel value="porcent" control={<Radio />} label="%" />
                  <FormControlLabel value="real" control={<Radio />} label="R$" />
                </RadioGroup>
              </FormControl>
              <InputText
                type="text"
                label={typeDiscount === 'real' ? 'Desconto em Real' : 'Desconto em Porcentagem'}
                mask={''}
                value={discount}
                setValue={setDiscount}
                onChange={(event) => setDiscount && setDiscount(event.target.value)}
                autoComplete="off"
                onKeyUp={onKeyUpDiscount}
                onKeyDown={handleKeyDownDiscount}
                disabled={isDisableManPower}
                isPercent={typeDiscount === 'porcent'}
              />
            </div>
          </GroupDiscount>
          <Total>
            <InputText
              type="text"
              label="Total"
              value={total}
              setValue={setTotal}
              autoComplete="off"
              hasError={!!messageErrorTotal}
              msgError={messageErrorTotal}
              disabled
            />
          </Total>
        </Row>
        <ButtonContainer>
          <Button
            textButton="Salvar"
            variant="contained"
            size="large"
            icon="add3"
            type="submit"
            loading={loading}
          />
          <Button
            textButton="Voltar"
            variant="outlined"
            size="large"
            icon="back"
            onClick={back}
          />
        </ButtonContainer>
      </Form>
    </Container>
  )
}

export default CreateOrderService
