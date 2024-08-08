import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { formatPrice } from 'src/helpers/formatPrice'
import { useModal } from 'src/hooks/useModal'
import { Row } from 'src/styles'
import CreatePiece from 'src/views/modules/administration/pieces/create'
import InputText from '../../components/InputCurrency'
import { ItemPieces } from '../../type'
import { Container, ContainerButtonPieceAdd } from './Styles'
import { ItemLaudoPieces } from './components/ItemPieces'

type TableViewPiecesProps = {
  setItemPieces: React.Dispatch<React.SetStateAction<ItemPieces[]>>
  itemPieces: ItemPieces[]
  setIsFirstLoadingPage: React.Dispatch<React.SetStateAction<boolean>>
}

const PiecesOS: React.FC<TableViewPiecesProps> = ({
  setItemPieces,
  itemPieces,
  setIsFirstLoadingPage
}) => {
  const { showMessage } = useModal()
  const [idRowWarning, setIdRowWarning] = useState('')

  const onHandlePiece = () => {
    showMessage(
      CreatePiece,
      {
        isNewServiceByOS: true,
      },
      true,
    )
  }

  const handleRemoveItem = (id: string | number) => {
    setIsFirstLoadingPage(false)
    setIdRowWarning('')
    setItemPieces((previousState) => [
      ...previousState.filter(
        (item) => item.id !== id,
      ),
    ])
  }
  return (
    <Container>
      <Row columns="5fr 0.1fr 1fr 1fr 1fr" gap={10} marginTop="5px">
        <ContainerButtonPieceAdd>
          <div>Peças ({itemPieces?.length || 0})</div>
          <Tooltip title="Clique aqui para adicionar uma nova peça">
            <IconButton aria-label="Adicionar" onClick={onHandlePiece}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        </ContainerButtonPieceAdd>
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
        <div
          style={{
            position: 'relative',
            left: '10px',
          }}
        >
        </div>
      </Row>

      <ItemLaudoPieces
        setIdRowWarning={setIdRowWarning}
        setItemPieces={setItemPieces}
        setIsFirstLoadingPage={setIsFirstLoadingPage}
        itemPieces={itemPieces} />

      {!!itemPieces.length && itemPieces.sort().map((item) => {
        const unit = formatPrice(item.unit)
        const total = formatPrice(item.total)
        const qtde = String(item.qtde)
        return (
          <Row display='flex' gap={2} marginTop="5px" border={idRowWarning === item.id && '1px solid #C00000'}>
            <InputText
              type="text"
              label={''}
              value={item.description}
              autoComplete="off"
              disabled
              width='100%'
            />
            <Row display='flex' gap={10} marginLeft='15px'>
              <Row position='relative' right='5px'>
                <InputText
                  type="text"
                  label={''}
                  value={qtde}
                  disabled
                  width="60px"
                />
              </Row>
              <Row position='relative' right='5px'>
                <InputText
                  type="text"
                  label={''}
                  value={unit}
                  autoComplete="off"
                  disabled
                />
              </Row>
              <Row position='relative' right='5px'>
                <InputText
                  type="text"
                  label={''}
                  value={total}
                  autoComplete="off"
                  disabled
                />
              </Row>
              <Row>
                <Tooltip title="Remover a peça" placement="left">
                  <IconButton
                    aria-label="delete"
                    size="large"
                    color="error"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <DeleteIcon fontSize="inherit" color="error" />
                  </IconButton>
                </Tooltip>
              </Row>
            </Row>
          </Row>
        )
      })}
    </Container>
  )
}

export default PiecesOS
