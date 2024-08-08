import React, { useState } from 'react'
import { Button, InputText } from 'src/components'
import { useModal } from 'src/hooks/useModal'
import { UpdateDeleteConfirmationContainer, Container, Text } from './style'
import { Expense } from '../Table/adapter'
import Alert from '@mui/material/Alert'
import PercentIcon from '@mui/icons-material/Percent'
import { Controller, useForm } from 'react-hook-form'
import InputMask from 'src/components/Form/InputMask'

type InsertPercentToPieceProps = {
  selectedAllRow: Expense[]
  onHandleRegisterPiece: (selectedAllRowState: Expense[]) => void
}

export const InsertPercentToPiece: React.FC<InsertPercentToPieceProps> = ({
  onHandleRegisterPiece,
  selectedAllRow,
}) => {
  const { closeModal } = useModal()
  const [selectedAllRowState] = useState(selectedAllRow)
  const { control, getValues, watch, setValue } = useForm()
  const [percentageValue, setPercentageValue] = useState('')

  const confirmation = async () => {
    await onHandleRegisterPiece(selectedAllRowState)
  }

  const cancel = () => {
    closeModal()
  }

  const onSetValue = (value: string) => {
    setValue('expense', value.replace('%', ''))
  }
  const onAddSimbol = (value: string) => {
    setValue('expense', `${value.replace('%', '')}%`)
  }

  const handleInputChange = (value: string) => {
    if (value.length === 1) {
      setValue('expense', `${value}%`)
    } else {
      setValue('expense', value)
    }
  }

  return (
    <Container isUseWidth>
      <Text>
        <PercentIcon />
      </Text>
      <Text>
        <Alert severity="info">
          Digite o percentual de margem de lucro que deseja para cada peça.
        </Alert>
      </Text>
      {selectedAllRowState.map((item, index) => (
        <div key={index}>
          <Controller
            name="expense"
            control={control}
            defaultValue=""
            render={({ field, fieldState }) => (
              <InputMask
                label={item.expense}
                mask=""
                maskChar=""
                setValue={(value) => handleInputChange(value)}
                alwaysShowMask={false}
              />
              // <InputText
              //   label={item.expense}
              //   field={field}
              //   fieldState={fieldState}
              //   toUpperCase={false}
              //   onKeyUp={() => onSetValue(field.value)}
              //   onBlur={() => onAddSimbol(field.value)}
              // />
            )}
          />
        </div>
      ))}
      <UpdateDeleteConfirmationContainer>
        <Button
          textButton="Registrar em Peça"
          variant="outlined"
          size="large"
          icon="add2"
          onClick={confirmation}
        />
        <Button
          textButton="Cancelar"
          variant="outlined"
          size="large"
          icon="close"
          color="error"
          onClick={cancel}
        />
      </UpdateDeleteConfirmationContainer>
    </Container>
  )
}
