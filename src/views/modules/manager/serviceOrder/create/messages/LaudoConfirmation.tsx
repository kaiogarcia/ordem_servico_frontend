import { Checkbox, FormGroup } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { AutocompleteOptions } from 'src/components/Form/Autocomplete'
import Button from 'src/components/Form/Button'
import { useModal } from 'src/hooks/useModal'
import { IStore } from 'src/store/Types'
import { Row } from 'src/styles'
import { Laudo } from '../tables/type'
import { ButtonGroup, Container, FormControlLabelStyled, Text } from './style'

type LaudoConfirmationProps = {
  clickedValue: AutocompleteOptions
  setLaudosList: (newState: any) => void
  setLaudos: React.Dispatch<React.SetStateAction<Laudo[]>>
  addService: () => void
  laudosList: any
}

const LaudoConfirmation: React.FC<LaudoConfirmationProps> = ({
  clickedValue,
  laudosList,
  setLaudosList,
  setLaudos,
  addService
}) => {
  const { closeModal } = useModal()

  const [laudo01, setLaudo01] = React.useState(false)
  const [laudo02, setLaudo02] = React.useState(false)
  const [laudo03, setLaudo03] = React.useState(false)
  const [laudo04, setLaudo04] = React.useState(false)
  const [laudo05, setLaudo05] = React.useState(false)
  const [laudo06, setLaudo06] = React.useState(false)
  const [laudo07, setLaudo07] = React.useState(false)
  const [laudo08, setLaudo08] = React.useState(false)
  const [laudo09, setLaudo09] = React.useState(false)

  const state = {
    laudo01,
    laudo02,
    laudo03,
    laudo04,
    laudo05,
    laudo06,
    laudo07,
    laudo08,
    laudo09,
    setLaudo01,
    setLaudo02,
    setLaudo03,
    setLaudo04,
    setLaudo05,
    setLaudo06,
    setLaudo07,
    setLaudo08,
    setLaudo09,
  }

  const allServices = useSelector((state: IStore) => state.service.services)

  const services = useSelector(
    (state: IStore) =>
      state.service.services.filter(
        (service) => service._id === clickedValue?.value,
      )[0],
  )

  const setLaudoChecked = (laudoList: any[]) => {
    let laudosChecked = []
    laudoList.map((item, index) => {
      if (item.service.includes(clickedValue.label)) {
        services?.laudos.filter((laudo, currentIndex) => {
          if (laudo.includes(item.description)) {
            laudosChecked.push({ checked: item.checked, currentIndex })
          }
        })
      }
    })
    laudosChecked.forEach((item) => {
      state[`setLaudo0${item.currentIndex + 1}`](item.checked)
    })
  }

  React.useEffect(() => {
    if (!!laudosList?.length) {
      setLaudoChecked(laudosList)
    }
  }, [laudosList])

  const handleChange = (event: any, laudo: string, index: number) => {
    if (laudo.includes(event.target.value)) {
      state[`setLaudo0${index}`](event.target.checked)

      if (!event.target.checked) {
        setLaudosList((previousState) => [
          ...previousState.filter((item) => {
            if (event.target.checked === false) {
              if (item.description !== event.target.value) {
                return item
              }
            } else {
              return item
            }
          }),
          {
            checked: event.target.checked,
            description: event.target.value,
            service: clickedValue.label,
          },
        ])
      } else {
        setLaudosList((previousState) => [
          ...previousState.filter((item) => item.checked),
          {
            checked: event.target.checked,
            description: event.target.value,
            service: clickedValue.label,
          },
        ])
      }
    }
  }

  const handleConfirmationButton = () => {
    addService()
    closeModal()
  }

  const deleteLaudos = (laudo: string) => {
    setLaudosList((prev: Laudo[]) => [
      ...prev.filter(
        (item) => item.description !== laudo,
      ),
    ])
    setLaudos((prev: Laudo[]) => [
      ...prev.filter(
        (item) => item.description !== laudo,
      ),
    ])
  }

  const onHandleCancel = () => {
    const laudos_allServices = allServices?.find((service) => service._id === clickedValue.value)?.laudos
    if (laudos_allServices) {
      laudos_allServices.forEach((laudo) => {
        deleteLaudos(laudo)
      })
    }
    closeModal()
  }

  return (
    <Container>
      {/* <Text>Selecione abaixo quais laudos deseja adicionar </Text> */}
      <Text bold>Serviço: {clickedValue.label}</Text>
      <Row columns="1fr" gap={1}>
        {services?.laudos.map((laudo, index) => {
          return (
            <FormGroup>
              <FormControlLabelStyled
                control={<Checkbox />}
                checked={state[`laudo0${index + 1}`]}
                onChange={(event) => handleChange(event, laudo, index + 1)}
                label={laudo}
                value={laudo}
              />
            </FormGroup>
          )
        })}
      </Row>
      <ButtonGroup>
        <Button
          textButton="Confirmar"
          variant="contained"
          color="success"
          icon="add3"
          onClick={handleConfirmationButton}
        />
        <Button
          textButton="Cancelar"
          variant="outlined"
          icon="close"
          color="info"
          onClick={onHandleCancel}
        />
      </ButtonGroup>
    </Container>
  )
}

export default LaudoConfirmation
