import { IconButton, Tooltip } from '@mui/material'
import React from 'react'
import { Row } from 'src/styles'
import { ItemPieces } from '../../type'
import { ItemLaudoPieces } from './components/ItemPieces'
import { Container, ContainerButtonPieceAdd } from './Styles'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useModal } from 'src/hooks/useModal'
import CreatePiece from 'src/views/modules/administration/pieces/create'

type TableViewPiecesProps = {
  setItemPieces: React.Dispatch<React.SetStateAction<ItemPieces[]>>
  itemPieces: ItemPieces[]
}

const TableViewPieces: React.FC<TableViewPiecesProps> = ({
  setItemPieces,
  itemPieces,
}) => {
  const { showMessage } = useModal()

  const onHandlePiece = () => {
    showMessage(
      CreatePiece,
      {
        isNewServiceByOS: true,
      },
      true,
    )
  }
  return (
    <Container>
      <Row columns="5fr 0.1fr 1fr 1fr" gap={10} marginTop="5px">
        <ContainerButtonPieceAdd>
          <div>Peças</div>
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
      </Row>
      <ItemLaudoPieces setItemPieces={setItemPieces} itemPieces={itemPieces} />
      <ItemLaudoPieces setItemPieces={setItemPieces} itemPieces={itemPieces} />
      <ItemLaudoPieces setItemPieces={setItemPieces} itemPieces={itemPieces} />
      <ItemLaudoPieces setItemPieces={setItemPieces} itemPieces={itemPieces} />
      <ItemLaudoPieces setItemPieces={setItemPieces} itemPieces={itemPieces} />
      <ItemLaudoPieces setItemPieces={setItemPieces} itemPieces={itemPieces} />
    </Container>
  )
}

export default TableViewPieces
