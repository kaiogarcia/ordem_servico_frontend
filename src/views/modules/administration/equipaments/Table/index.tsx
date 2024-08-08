import React from 'react'
import { useSelector } from 'react-redux'
import { DataTable } from 'src/components/Widgets/DataTable'
import { EquipamentT, IStore } from 'src/store/Types'
import { useColumns } from './Columns'

const TableView: React.FC = () => {
  const equipamentsStore = useSelector(
    (state: IStore) => state.equipament?.equipaments,
  )

  const columns = useColumns()

  const mapped = (serviceOrder: EquipamentT[]): EquipamentT[] => {
    return serviceOrder.map((item: EquipamentT) => {
      return {
        id: item._id,
        ...item,
      }
    })
  }

  return (
    <>
      <div style={{ margin: '20px', fontWeight: 'bold', fontSize: '16px' }}>
        {!!equipamentsStore?.length && (
          <div>
            <div>Resultados encontrados</div>
            <div style={{ fontSize: '12px' }}>
              Total: ({equipamentsStore?.length})
            </div>
          </div>
        )}
      </div>
      <DataTable
        rows={mapped(equipamentsStore)}
        columns={columns}
        pageSize={50}
      />
    </>
  )
}

export default TableView
