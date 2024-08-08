/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { Button } from 'src/components'
import { DataTable } from 'src/components/Widgets/DataTable'
import { toast } from 'src/components/Widgets/Toastify'
import { formatPrice } from 'src/helpers/formatPrice'
import { useLoading } from 'src/hooks/useLoading'
import { useModal } from 'src/hooks/useModal'
import { usePermission } from 'src/hooks/usePermission'
import { useAdmin } from 'src/services/useAdmin'
import { DESPESAS_EDITAR } from 'src/views/modules/administration/permissions/static/keysPermissions'
import useLocalStorage from 'use-local-storage'
import { Expense } from './adapter'
import { useColumns } from './Columns'
import { ButtonGenerateOSContainer } from './Styles'

type TableViewProps = {
  incomesFiltered: Expense[]
  setMakeRequest: React.Dispatch<React.SetStateAction<number>>
}

type SelectedRowByExpenseType = {
  expenseTypePessoalId: string[]
  expenseTypeEmpresaId: string[]
}

const TableView: React.FC<TableViewProps> = ({
  incomesFiltered,
  setMakeRequest,
}) => {
  const columns = useColumns({ setMakeRequest })
  const { apiAdmin } = useAdmin()
  const { Loading } = useLoading()
  const { showSimple } = useModal()
  const { hasPermission } = usePermission()

  const [selectedAllRowIds, setSelectedAllRowIds] = useState<string[]>(
    [] as string[],
  )
  const [selectedRowByExpenseType, setSelectedRowByExpenseType] = useState<SelectedRowByExpenseType>(
    {} as SelectedRowByExpenseType
  )
  const [selectedAllRow, setSelectedAllRow] = useState<Expense[]>(
    [] as Expense[],
  )
  const status = JSON.parse(
    window.localStorage.getItem('selectedButtonExpense'),
  )

  const mappedExpensesFinancial = (serviceOrder: Expense[]): Expense[] => {
    return serviceOrder.map((item: Expense) => item)
  }

  const [_, setSuccessRegistrationData] = useLocalStorage(
    'successRegistrationData',
    [],
  )

  const updateStatus = async (id: string) => {
    try {
      await apiAdmin.put(`expense/${id}`, {
        status: status === 'A PAGAR' ? 'PAGO' : 'A PAGAR',
      })
    } catch (error) {
      toast.error(
        'Opss! Ocorreu um erro ao tentar atualiza o status do registro financeiro.',
      )
    }
  }

  const updateExpenseType = async (id: string, expenseType: string) => {
    try {
      await apiAdmin.put(`expense/${id}`, {
        expense_type: expenseType,
      })
    } catch (error) {
      toast.error(
        'Opss! Ocorreu um erro ao tentar atualiza o tipo de despesa.',
      )
    }
  }

  const updateRegiterPiece = async (expense: Expense) => {
    try {
      const { data } = await apiAdmin.post(`pieces/register`, {
        description: expense.expense,
        value: expense.value,
      })
      if (data.status === 201) {
        setSuccessRegistrationData((item) => [...item, data])
      }
    } catch ({ response }) {
      if (response?.status === 403) {
        toast.error(response?.data?.message)
      } else {
        toast.error(
          'Opss! Ocorreu um erro ao tentar atualiza o status do registro financeiro.',
        )
      }
    }
  }

  const onHandleUpdateStatus = async () => {
    let index = 0
    Loading.turnOn()
    for (index; index < selectedAllRowIds.length; index++) {
      const id = selectedAllRowIds[index]
      await updateStatus(id)
      if (index === selectedAllRowIds.length - 1) {
        Loading.turnOff()
        setMakeRequest(Math.random())
        showSimple.success(
          `${selectedAllRowIds.length} registros registrados em peças com sucesso.`,
        )
      }
    }
  }

  const onHandleUpdateExpenseType = async (expenseTypeList: string[], expenseType: string) => {
    let index = 0
    Loading.turnOn()
    for (index; index < expenseTypeList.length; index++) {
      const id = expenseTypeList[index]
      await updateExpenseType(id, expenseType)
      if (index === expenseTypeList.length - 1) {
        Loading.turnOff()
        setMakeRequest(Math.random())
        showSimple.success(
          `${expenseTypeList.length} registros atualizado para Despesa ${expenseType} com sucesso.`,
        )
      }
    }
  }

  const onHandleRegisterPiece = async (selectedAllRow: Expense[]) => {
    let index = 0
    window.localStorage.removeItem('successRegistrationData')
    Loading.turnOn()
    for (index; index < selectedAllRow.length; index++) {
      const expense = selectedAllRow[index]
      await updateRegiterPiece(expense)
      if (index === selectedAllRow.length - 1) {
        Loading.turnOff()
        setMakeRequest(Math.random())
        const successRegistrationDataResult = JSON.parse(
          window.localStorage.getItem('successRegistrationData'),
        )
        const message =
          successRegistrationDataResult.length > 1
            ? 'registros registrados em peças com sucesso'
            : 'registro registrado em peças com sucesso'
        if (successRegistrationDataResult.length) {
          showSimple.success(
            `${successRegistrationDataResult.length} ${message}`,
          )
        }
      }
    }
  }

  // const setPercentValueToPiece = async () => {
  //   showMessage(InsertPercentToPiece, { selectedAllRow, onHandleRegisterPiece })
  // }

  // const checkIfRegister = async () => {
  //   const isRegister = selectedAllRow.find((item) => item.isRegister)
  //   if (isRegister) {
  //     showMessage(ConfirmationToRegisterInPiece, { setPercentValueToPiece })
  //   } else {
  //     await setPercentValueToPiece()
  //   }
  // }

  React.useEffect(() => {
    return () => {
      window.localStorage.removeItem('successRegistrationData')
    }
  }, [])

  React.useEffect(() => {
    if (!incomesFiltered.length) {
      setSelectedAllRow([])
    }
  }, [incomesFiltered])

  React.useEffect(() => {
    const resultFilterPessoal = selectedAllRow.filter((item) => item.expense_type === 'Pessoal').map((item) => item.id)
    const resultFilterEmpresa = selectedAllRow.filter((item) => item.expense_type === 'Empresa').map((item) => item.id)
    setSelectedRowByExpenseType((previousState: SelectedRowByExpenseType) => ({
      ...previousState,
      expenseTypePessoalId: resultFilterPessoal,
      expenseTypeEmpresaId: resultFilterEmpresa
    }))
  }, [selectedAllRow])

  return (
    <>
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
            gap: '20px',
            paddingTop: !!selectedAllRowIds?.length ? '' : '9px',
            paddingBottom: !!selectedAllRowIds?.length ? '' : '9px'
          }}
        >
          {!!incomesFiltered?.length && (
            <>
              <div style={{ marginTop: '7px' }}>
                Total:{' '}
                <b>{formatPrice(
                  incomesFiltered?.reduce((sum, row) => sum + row.value, 0),
                )}</b>
              </div>
              <div style={{ marginTop: '7px' }}>
                Quantidade de registros encontrados: <b>{incomesFiltered?.length}</b>
              </div>
            </>
          )}
          {!!selectedAllRow.length && <div style={{ marginTop: '7px' }}>
            Total Selecionado:{' '}
            <b>{formatPrice(
              selectedAllRow?.reduce((sum, row) => sum + row.value, 0),
            )}</b>
          </div>}
          {!!selectedAllRowIds?.length && (
            <>
              <ButtonGenerateOSContainer>
                <Button
                  textButton={`Atualizar para ${status === 'A PAGAR' ? 'PAGO' : 'A PAGAR'
                    } (${selectedAllRowIds?.length})`}
                  variant={'outlined'}
                  size="small"
                  icon={status === 'A PAGAR' ? 'update2' : 'update'}
                  color={status === 'A PAGAR' ? 'success' : 'warning'}
                  onClick={onHandleUpdateStatus}
                  disabled={!hasPermission(DESPESAS_EDITAR)}
                />
                {/* <Badge
                  badgeContent={selectedAllRowIds?.length}
                  color={status === 'A PAGAR' ? 'success' : 'warning'}
                >
                </Badge> */}
              </ButtonGenerateOSContainer>
            </>
          )}
          {!!selectedRowByExpenseType.expenseTypeEmpresaId?.length && (
            <>
              <ButtonGenerateOSContainer>
                <Button
                  textButton={`Atualizar para Despesa Pessoal (${selectedRowByExpenseType.expenseTypeEmpresaId?.length})`}
                  variant={'outlined'}
                  size="small"
                  icon={'update'}
                  color={'primary'}
                  onClick={() => onHandleUpdateExpenseType(selectedRowByExpenseType.expenseTypeEmpresaId, 'Pessoal')}
                  disabled={!hasPermission(DESPESAS_EDITAR)}
                />
                {/* <Badge
                  badgeContent={selectedAllRowIds?.length}
                  color={status === 'A PAGAR' ? 'success' : 'warning'}
                >
                </Badge> */}
              </ButtonGenerateOSContainer>
            </>
          )}
          {!!selectedRowByExpenseType.expenseTypePessoalId?.length && (
            <>
              <ButtonGenerateOSContainer>
                <Button
                  textButton={`Atualizar para Despesa Empresa (${selectedRowByExpenseType.expenseTypePessoalId?.length})`}
                  variant={'outlined'}
                  size="small"
                  icon={'update'}
                  color={'secondary'}
                  onClick={() => onHandleUpdateExpenseType(selectedRowByExpenseType.expenseTypePessoalId, 'Empresa')}
                  disabled={!hasPermission(DESPESAS_EDITAR)}
                />
                {/* <Badge
                  badgeContent={selectedAllRowIds?.length}
                  color={status === 'A PAGAR' ? 'success' : 'warning'}
                >
                </Badge> */}
              </ButtonGenerateOSContainer>
            </>
          )}
        </div>
      </>
      <DataTable
        rows={mappedExpensesFinancial(incomesFiltered)}
        columns={columns}
        pageSize={50}
        checkboxSelection
        setSelectedAllRowIds={setSelectedAllRowIds}
        setCellClick={setSelectedAllRow}
      />
    </>
  )
}

export default TableView
