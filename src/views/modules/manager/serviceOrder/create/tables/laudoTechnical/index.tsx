/* eslint-disable react-hooks/exhaustive-deps */
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import lodash from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AutocompleteOptions } from 'src/components/Form/Autocomplete'
import { useModal } from 'src/hooks/useModal'
import { IStore } from 'src/store/Types'
import { Row } from 'src/styles'
import CreateService from 'src/views/modules/administration/services/create'
import LaudoConfirmation from '../../messages/LaudoConfirmation'
import { ItemServices } from '../../type'
import LaudoDetails from '../laudoDetails'
import { Laudo } from '../type'
import { Container, ContainerButtonServiceAdd } from './Styles'
import { ItemLaudoTechnical } from './components'

type TableViewProps = {
  itemServices: ItemServices[]
  setItemServices: React.Dispatch<React.SetStateAction<ItemServices[]>>
  laudos: Laudo[]
  setLaudos: React.Dispatch<React.SetStateAction<Laudo[]>>
}

const TableView: React.FC<TableViewProps> = ({
  itemServices,
  setItemServices,
  laudos,
  setLaudos,
}) => {
  const { showMessage, showSimple } = useModal()
  const [clickedValue, setClickedValue] = useState({} as AutocompleteOptions)
  const [laudosList, setLaudosList] = React.useState<Laudo[]>([] as Laudo[])

  const services = useSelector(
    (state: IStore) =>
      state.service.services.filter(
        (service) => service._id === clickedValue?.value,
      )[0],
  )

  // const checkLengthLaudos = (laudos: Laudo[]): boolean => {
  //   if (laudos.length > 5) {
  //     showSimple.warning('Não é possível adicionar mais de 6 laudos.')
  //     return false
  //   } else {
  //     return true
  //   }
  // }

  useEffect(() => {
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
              },
              true,
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
          // setLaudos((laudos) => [
          //   ...laudos,
          //   laudos.length <= 5
          //     ? {
          //         checked: true,
          //         description: String(services.laudos[0]).toUpperCase(),
          //         service: clickedValue.label,
          //       }
          //     : undefined,
          // ])
        }
      }
    }
  }, [clickedValue])

  const addLaudos = (data: Laudo[]) => {
    setLaudos((laudos) => {
      const resultUnion = lodash.unionWith<Laudo>(laudos, data, lodash.isEqual)
      for (let a = resultUnion.length - 1; a >= 0; a--) {
        for (let b = 0; b < data.length; b++) {
          if (
            !data[b].checked &&
            resultUnion[a].checked &&
            data[b].description === resultUnion[a].description
          ) {
            resultUnion.splice(a, 1)
          }
        }
      }
      return resultUnion.filter((item) => item.checked)
    })
  }

  useEffect(() => {
    if (!!laudosList.length) {
      addLaudos(laudosList)
    }
  }, [laudosList])

  const onHandleAddNewService = () => {
    showMessage(
      CreateService,
      {
        isNewServiceByOS: true,
      },
      true,
    )
  }

  return (
    <Container>
      <Row columns="5fr 0.1fr 1fr 1fr" gap={10} marginTop="5px">
        <ContainerButtonServiceAdd>
          <div>Serviços</div>
          <Tooltip title="Clique aqui para adicionar um novo Serviço">
            <IconButton aria-label="Adicionar" onClick={onHandleAddNewService}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        </ContainerButtonServiceAdd>
        <div
          style={{
            position: 'relative',
            right: '20px',
          }}
        >
          Qtd
        </div>
        <div
          style={{
            position: 'relative',
            left: '10px',
          }}
        >
          Unit
        </div>
        <div
          style={{
            position: 'relative',
            left: '10px',
          }}
        >
          Preço
        </div>
      </Row>

      <ItemLaudoTechnical
        setClickedValue={setClickedValue}
        setItemServices={setItemServices}
        itemServices={itemServices}
      />
      <ItemLaudoTechnical
        setClickedValue={setClickedValue}
        setItemServices={setItemServices}
        itemServices={itemServices}
      />
      <ItemLaudoTechnical
        setClickedValue={setClickedValue}
        setItemServices={setItemServices}
        itemServices={itemServices}
      />
      <ItemLaudoTechnical
        setClickedValue={setClickedValue}
        setItemServices={setItemServices}
        itemServices={itemServices}
      />
      <ItemLaudoTechnical
        setClickedValue={setClickedValue}
        setItemServices={setItemServices}
        itemServices={itemServices}
      />
      <ItemLaudoTechnical
        setClickedValue={setClickedValue}
        setItemServices={setItemServices}
        itemServices={itemServices}
      />

      <LaudoDetails
        laudos={laudos}
        setLaudos={setLaudos}
        setLaudosList={setLaudosList}
      />
    </Container>
  )
}

export default TableView
