import React from 'react'
import { DataTable } from 'src/components/Widgets/DataTable'
import { User } from '../type'
import { useColumns } from './Columns'

type TableViewProps = {
  users: User[]
}

const TableView: React.FC<TableViewProps> = ({ users }) => {

  const columns = useColumns()

  const mapped = (serviceOrder: User[]): User[] => {
    const result = serviceOrder.map((item: User) => {
      return {
        id: item._id,
        ...item,
      }
    })
    return result
  }

  return (
    <>
      <div style={{ margin: '20px', fontWeight: 'bold', fontSize: '16px' }}>
        {!!users?.length && (
          <div>
            <div>Resultados encontrados</div>
            <div style={{ fontSize: '12px' }}>
              Total: ({users?.length})
            </div>
          </div>
        )}
      </div>
      <DataTable
        rows={mapped(users)}
        columns={columns}
        pageSize={50}
      />
    </>
  )
}

export default TableView
