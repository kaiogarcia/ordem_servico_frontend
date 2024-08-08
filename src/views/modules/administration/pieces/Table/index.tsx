import React from 'react'
import { useSelector } from 'react-redux'
import { DataTable } from 'src/components/Widgets/DataTable'
import { IStore, PieceT } from 'src/store/Types'
import { useColumns } from './Columns'

const TableView: React.FC = () => {
  const piecesStore = useSelector((state: IStore) => state.piece.pieces)

  const columns = useColumns()

  const mapped = (serviceOrder: PieceT[]): PieceT[] => {
    return serviceOrder.map((item: PieceT) => {
      return {
        id: item._id,
        ...item,
      }
    })
  }

  return (
    <>
      <div style={{ margin: '20px', fontWeight: 'bold', fontSize: '16px' }}>
        {!!piecesStore?.length && (
          <div>
            <div>Resultados encontrados</div>
            <div style={{ fontSize: '12px' }}>
              Total: ({piecesStore?.length})
            </div>
          </div>
        )}
      </div>
      <DataTable rows={mapped(piecesStore)} columns={columns} pageSize={50} />
    </>
  )
}

export default TableView
