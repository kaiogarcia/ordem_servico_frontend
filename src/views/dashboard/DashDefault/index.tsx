/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import GroupIcon from '@mui/icons-material/Group'
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService'
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import { Tooltip } from '@mui/material'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { exceptionHandle } from 'src/helpers/exceptions'
import { formatPrice } from 'src/helpers/formatPrice'
import { useAuth } from 'src/hooks/useAuth'
import { useLoading } from 'src/hooks/useLoading'
import { ADMINISTRATION_CLIENTS, ADMINISTRATION_EQUIPAMENTS, ADMINISTRATION_PIECES, ADMINISTRATION_SERVICES, MANAGER_SERVICE_ORDER } from 'src/layouts/typePath'
import { ClientT } from 'src/store/Types'
import { OSData } from 'src/views/modules/manager/serviceOrder/create/type'
import AmChartStatistics6 from './chart/AmChartStatistics6'
import { useDashBoard } from './functions'
import { ContainerIcon } from './style'
// import { Link } from 'react-router-dom'
// import AmChartEarnings from './chart/AmChartEarnings'
// import avatar1 from '../../../assets/images/user/avatar-1.jpg'
// import avatar2 from '../../../assets/images/user/avatar-2.jpg'
// import avatar3 from '../../../assets/images/user/avatar-3.jpg'

export type DataChart = {
  month: string
  incomes: number
  expenses: number
  personal_expenses: number
  profit: number
}

export type Total = {
  totalClients: number
  totalOrderService: number
  totalPieces: number
  totalServices: number
  totalEquipaments: number
  totalIncomes: number
  totalProfitMonth: number
  totalExpenses: number
  totalValueExpenseInExpired: number
  qtdeExpenseInExpired: number
  totalValueIncomeInExpired3Days: number
  totalPersonalExpense: number
  expiredTotal: number
  totalIncomesPending: number
  clientsWithoutEmail: ClientT[]
  boletoNotImported: OSData[]
  dataChart: DataChart[]
  totalExpenseEmpresaMonth: number
  totalExpensePessoalMonth: number
  currentMonth: string
}

const DashDefault: React.FC = () => {
  const { Loading } = useLoading()
  const history = useHistory()
  const { user } = useAuth()
  const [typeUser] = useState(user?.user.typeUser)

  const [total, setTotal] = useState<Total>({
    totalClients: 0,
    totalOrderService: 0,
    totalPieces: 0,
    totalServices: 0,
    totalEquipaments: 0,
    totalIncomes: 0,
    totalProfitMonth: 0,
    totalExpenses: 0,
    qtdeExpenseInExpired: 0,
    totalValueExpenseInExpired: 0,
    totalValueIncomeInExpired3Days: 0,
    expiredTotal: 0,
    totalIncomesPending: 0,
    totalPersonalExpense: 0,
    clientsWithoutEmail: [],
    boletoNotImported: [],
    dataChart: [],
    totalExpenseEmpresaMonth: 0,
    totalExpensePessoalMonth: 0,
    currentMonth: ''
  } as Total)
  const {
    getTotalClients,
    getTotalOrderServices,
    getTotalPecas,
    getTotalServices,
    getTotalEquipaments,
    getTotalIncomes,
    getTotalExpenses,
    getTotalExpired,
    getTotalExpiredMaturityIn3Days,
    getTotalClientWithoutEmail,
    getTotalBoletoNotImported,
    getTotalPersonalExpense,
    getDataChart,
    getTotalPersonalExpenseMonth,
    getTotalProfitMonth
  } = useDashBoard({ setTotal })

  const getTotal = async () => {
    try {
      Loading.turnOn()
      await getTotalClients()
      await getTotalOrderServices()
      await getTotalPecas()
      await getTotalServices()
      await getTotalEquipaments()
      await getTotalIncomes()
      await getTotalExpenses()
      await getTotalExpired()
      await getTotalExpiredMaturityIn3Days()
      await getTotalClientWithoutEmail()
      await getTotalBoletoNotImported()
      await getTotalPersonalExpense()
      await getDataChart()
      await getTotalPersonalExpenseMonth()
      await getTotalProfitMonth()
    } catch (err) {
      exceptionHandle(err)
    } finally {
      Loading.turnOff()
    }
  }

  React.useEffect(() => {
    getTotal()
  }, [])

  const checkPluralText = () => {
    if (total?.totalValueIncomeInExpired3Days > 1) {
      return 'Boletos'
    } else {
      return 'Boleto'
    }
  }
  const checkPluralTextClient = () => {
    if (total.clientsWithoutEmail.length > 1) {
      return 'clientes que precisam'
    } else {
      return 'cliente que precisa'
    }
  }
  const checkPluralTextOrderServiceWithoutBoleto = () => {
    if (total.boletoNotImported.length > 1) {
      return 'ordens de serviços que precisam'
    } else {
      return 'ordem de serviço que precisa'
    }
  }

  return (
    <React.Fragment>
      {total?.totalValueExpenseInExpired > 0 &&
        <Row>
          <Col md={12} xl={12}>
            <Alert severity="warning" style={{ display: 'flex', alignItems: 'center' }}>
              <span><b>Atenção:</b> Você tem <Chip label={formatPrice(total.totalValueExpenseInExpired)} /> de despesas a vencer</span>
              {total?.qtdeExpenseInExpired > 0 && <span> e <b>{total.qtdeExpenseInExpired}</b> despesas a vencer daqui <Chip label="3 dias" />.</span>}
            </Alert>
          </Col>
        </Row>
      }
      {total.expiredTotal > 0 && <Row>
        <Col md={12} xl={12}>
          <Alert severity="error" style={{ display: 'flex', alignItems: 'center' }}>
            <span><b>Atenção:</b> Você tem um total de <Chip label={formatPrice(total.expiredTotal)} /> de despesas <Chip label={'Vencidas'} /></span>
          </Alert>
        </Col>
      </Row>}
      {total?.totalValueIncomeInExpired3Days > 0 && <Row>
        <Col md={12} xl={12}>
          <Alert severity="info" style={{ display: 'flex', alignItems: 'center' }}>
            <span><b>Atenção:</b> Você tem <Chip label={(total?.totalValueIncomeInExpired3Days)} /> {checkPluralText()} a vencer daqui a 3 dias. Entre em contato com o cliente.</span>
          </Alert>
        </Col>
      </Row>}
      {!!total.clientsWithoutEmail.length &&
        <Row>
          <Col md={12} xl={12}>
            <Alert severity="warning" style={{ display: 'flex', alignItems: 'center' }}>
              <span><b>Atenção:</b> Você possui <Chip label={(total.clientsWithoutEmail.length)} /> {checkPluralTextClient()} de atualização do e-mail para o envio da cobrança. Segue abaixo:</span>
              <ul>
                {total.clientsWithoutEmail.map((client) => {
                  return (
                    <div>
                      <li>Cliente: {client.name}</li>
                    </div>
                  )
                })}
              </ul>
              <div onClick={() => history.push(ADMINISTRATION_CLIENTS)}><a href='#'>Clique aqui</a> para acessar a área de clientes.</div>
            </Alert>
          </Col>
        </Row>}
      {!!total.boletoNotImported.length &&
        <Row>
          <Col md={12} xl={12}>
            <Alert severity="warning" style={{ display: 'flex', alignItems: 'center' }}>
              <span><b>Atenção:</b> Você tem <Chip label={(total.boletoNotImported.length)} /> {checkPluralTextOrderServiceWithoutBoleto()} de importação do boleto para o envio da cobrança. Segue abaixo:</span>
              <ul>
                {total.boletoNotImported.map((client) => {
                  return (
                    <div>
                      <li>Ordem de Serviço: Nº {client.osNumber}</li>
                    </div>
                  )
                })}
              </ul>
              <div onClick={() => history.push(MANAGER_SERVICE_ORDER)}><a href='#'>Clique aqui</a> para acessar a área de ordens de serviços.</div>
            </Alert>
          </Col>
        </Row>}
      <Row>
        {typeUser === 'ADMIN' && <Col xl={3} >
          <Card>
            <Card.Body>
              <h6 className="mb-4">Total Receitas</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className="feather icon-arrow-up text-c-green f-30 m-r-5" />{' '}
                    {formatPrice(total.totalIncomes)}
                  </h3>
                </div>

                <div className="col-3 text-right">
                  {/* <p className="m-b-0">50%</p> */}
                </div>
              </div>
              {/* <div className="progress m-t-30" style={{ height: '7px' }}>
                <div
                  className="progress-bar progress-c-theme"
                  role="progressbar"
                  style={{ width: '50%' }}
                  aria-valuenow="50"
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div> */}
            </Card.Body>
          </Card>
        </Col>}
        {typeUser === 'ADMIN' && <Col xl={3} >
          <Card>
            <Card.Body>
              <h6 className={'mb-4'}>Total Despesas Empresa</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className="feather icon-arrow-down text-c-red f-30 m-r-5" />{' '}
                    {formatPrice(total.totalExpenses)}
                  </h3>
                </div>
                <div className="col-3 text-right">
                  {/* <p className="m-b-0">36%</p> */}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>}
        {typeUser === 'ADMIN' && <Col xl={3} >
          <Card>
            <Card.Body>
              <h6 className={'mb-4'}>Total Despesas Pessoal</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className="feather icon-arrow-down text-c-red f-30 m-r-5" />{' '}
                    {formatPrice(total.totalPersonalExpense)}
                  </h3>
                </div>
                <div className="col-3 text-right">
                  {/* <p className="m-b-0">36%</p> */}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>}
        {typeUser === 'ADMIN' && <Col xl={3}>
          <Card >
            <Tooltip title='O cálculo do lucro total não se aplica as despesas pessoais, somente as despesas da empresa.'>
              <Card.Body>
                <h6 className="mb-4">Saldo da Conta</h6>
                <div className="row d-flex align-items-center">
                  <div className="col-9">
                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                      <i
                        className={`feather ${total.totalIncomes - total.totalExpenses < 0
                          ? 'icon-arrow-down text-c-red'
                          : 'icon-arrow-up text-c-green'
                          } f-30 m-r-5`}
                      />{' '}
                      {formatPrice(total.totalIncomes - total.totalExpenses)}
                    </h3>
                  </div>

                  <div className="col-3 text-right">
                    {/* <p className="m-b-0">70%</p> */}
                  </div>
                </div>
              </Card.Body>
            </Tooltip>
          </Card>
        </Col>}
        {typeUser === 'ADMIN' && <Col xl={3} >
          <Card>
            <Card.Body>
              <h6 className="mb-4">A Receber</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i style={{ color: 'orange' }} className="feather icon-info f-30 m-r-5" />{' '}
                    {formatPrice(total.totalIncomesPending)}
                  </h3>
                </div>

                <div className="col-3 text-right">
                  {/* <p className="m-b-0">36%</p> */}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>}
        {typeUser === 'ADMIN' && <Col xl={3}>
          <Card >
            <Tooltip title={`Referente ao mês de ${total.currentMonth}`}>
              <Card.Body>
                <h6 className="mb-4">Despesa do Mês Empresa</h6>
                <div className="row d-flex align-items-center">
                  <div className="col-9">
                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                      <i
                        className={`feather icon-arrow-down text-c-red f-30 m-r-5`}
                      />{' '}
                      {formatPrice(total.totalExpenseEmpresaMonth)}
                    </h3>
                  </div>

                  <div className="col-3 text-right">
                    {/* <p className="m-b-0">70%</p> */}
                  </div>
                </div>
              </Card.Body>
            </Tooltip>
          </Card>
        </Col>}
        {typeUser === 'ADMIN' && <Col xl={3}>
          <Card >
            <Tooltip title={`Referente ao mês de ${total.currentMonth}`}>
              <Card.Body>
                <h6 className="mb-4">Despesa do Mês Pessoal</h6>
                <div className="row d-flex align-items-center">
                  <div className="col-9">
                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                      <i
                        className={`feather icon-arrow-down text-c-red f-30 m-r-5`}
                      />{' '}
                      {formatPrice(total.totalExpensePessoalMonth)}
                    </h3>
                  </div>

                  <div className="col-3 text-right">
                    {/* <p className="m-b-0">70%</p> */}
                  </div>
                </div>
              </Card.Body>
            </Tooltip>
          </Card>
        </Col>}
        {typeUser === 'ADMIN' && <Col xl={3}>
          <Card >
            <Tooltip title={`O cálculo do lucro do mês não se aplica as despesas pessoais, somente as despesas da empresa. Referente ao mês de ${total.currentMonth}`}>
              <Card.Body>
                <h6 className="mb-4">Lucro do Mês</h6>
                <div className="row d-flex align-items-center">
                  <div className="col-9">
                    <h3 className="f-w-300 d-flex align-items-center m-b-0">
                      <i
                        className={`feather ${total.totalProfitMonth < 0
                          ? 'icon-arrow-down text-c-red'
                          : 'icon-arrow-up text-c-green'
                          } f-30 m-r-5`}
                      />{' '}
                      {formatPrice(total.totalProfitMonth)}
                    </h3>
                  </div>

                  <div className="col-3 text-right">
                    {/* <p className="m-b-0">70%</p> */}
                  </div>
                </div>
              </Card.Body>
            </Tooltip>
          </Card>
        </Col>}
        {typeUser === 'ADMIN' && <Col md={6} xl={8}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Gráfico</Card.Title>
            </Card.Header>
            <Card.Body>
              <AmChartStatistics6 height="482px" dataChart={total.dataChart} />
            </Card.Body>
          </Card>
        </Col>}
        <Col md={typeUser === 'ADMIN' ? 6 : 12} xl={typeUser === 'ADMIN' ? 4 : 12}>
          <Card style={{ flexDirection: typeUser === 'ADMIN' ? 'column' : 'row' }}>
            <Card.Body className="border-bottom">
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  {/* <i className="feather icon-zap f-30 text-c-green" /> */}
                  <ContainerIcon>
                    <GroupIcon />
                  </ContainerIcon>
                </div>
                <div className="col" onClick={() => history.push(ADMINISTRATION_CLIENTS)} style={{ cursor: 'pointer' }}>
                  <h3 className="f-w-300">{total.totalClients}</h3>
                  <span className="d-block text-uppercase">
                    Total de Clientes
                  </span>
                </div>
              </div>
            </Card.Body>
            <Card.Body className="border-bottom">
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  {/* <i className="feather icon-map-pin f-30 text-c-blue" /> */}
                  <ContainerIcon>
                    <ContentPasteIcon />
                  </ContainerIcon>
                </div>
                <div className="col" onClick={() => history.push(MANAGER_SERVICE_ORDER)} style={{ cursor: 'pointer' }}>
                  <h3 className="f-w-300">{total.totalOrderService}</h3>
                  <span className="d-block text-uppercase">
                    Total de Ordens de Serviços
                  </span>
                </div>
              </div>
            </Card.Body>
            <Card.Body className="border-bottom">
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  {/* <i className="feather icon-map-pin f-30 text-c-blue" /> */}
                  <ContainerIcon>
                    <HomeRepairServiceIcon />
                  </ContainerIcon>
                </div>
                <div className="col" onClick={() => history.push(ADMINISTRATION_PIECES)} style={{ cursor: 'pointer' }}>
                  <h3 className="f-w-300">{total.totalPieces}</h3>
                  <span className="d-block text-uppercase">
                    Total de Peças Cadastradas
                  </span>
                </div>
              </div>
            </Card.Body>
            <Card.Body className="border-bottom">
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  {/* <i className="feather icon-map-pin f-30 text-c-blue" /> */}
                  <ContainerIcon>
                    <ManageAccountsIcon />
                  </ContainerIcon>
                </div>
                <div className="col" onClick={() => history.push(ADMINISTRATION_SERVICES)} style={{ cursor: 'pointer' }}>
                  <h3 className="f-w-300">{total.totalServices}</h3>
                  <span className="d-block text-uppercase">
                    Total de Serviços
                  </span>
                </div>
              </div>
            </Card.Body>
            <Card.Body className="border-bottom">
              <div className="row d-flex align-items-center">
                <div className="col-auto">
                  {/* <i className="feather icon-map-pin f-30 text-c-blue" /> */}
                  <ContainerIcon>
                    <ImportantDevicesIcon />
                  </ContainerIcon>
                </div>
                <div className="col" onClick={() => history.push(ADMINISTRATION_EQUIPAMENTS)} style={{ cursor: 'pointer' }}>
                  <h3 className="f-w-300">{total.totalEquipaments}</h3>
                  <span className="d-block text-uppercase">
                    Total de Equipamentos
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        {/* <Col md={6} xl={4}>
          <Card className="card-social">
            <Card.Body className="border-bottom">
              <div className="row align-items-center justify-content-center">
                <div className="col-auto">
                  <i className="fab fa-facebook-f text-primary f-36" />
                </div>
                <div className="col text-right">
                  <h3>12,281</h3>
                  <h5 className="text-c-green mb-0">
                    +7.2% <span className="text-muted">Total Likes</span>
                  </h5>
                </div>
              </div>
            </Card.Body>
            <Card.Body>
              <div className="row align-items-center justify-content-center card-active">
                <div className="col-6">
                  <h6 className="text-center m-b-10">
                    <span className="text-muted m-r-5">Target:</span>35,098
                  </h6>
                  <div className="progress">
                    <div
                      className="progress-bar progress-c-theme"
                      role="progressbar"
                      style={{ width: '60%', height: '6px' }}
                      aria-valuenow="60"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <h6 className="text-center  m-b-10">
                    <span className="text-muted m-r-5">Duration:</span>350
                  </h6>
                  <div className="progress">
                    <div
                      className="progress-bar progress-c-theme2"
                      role="progressbar"
                      style={{ width: '45%', height: '6px' }}
                      aria-valuenow="45"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={4}>
          <Card className="card-social">
            <Card.Body className="border-bottom">
              <div className="row align-items-center justify-content-center">
                <div className="col-auto">
                  <i className="fab fa-twitter text-c-blue f-36" />
                </div>
                <div className="col text-right">
                  <h3>11,200</h3>
                  <h5 className="text-c-purple mb-0">
                    +6.2% <span className="text-muted">Total Likes</span>
                  </h5>
                </div>
              </div>
            </Card.Body>
            <Card.Body>
              <div className="row align-items-center justify-content-center card-active">
                <div className="col-6">
                  <h6 className="text-center m-b-10">
                    <span className="text-muted m-r-5">Target:</span>34,185
                  </h6>
                  <div className="progress">
                    <div
                      className="progress-bar progress-c-green"
                      role="progressbar"
                      style={{ width: '40%', height: '6px' }}
                      aria-valuenow="40"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <h6 className="text-center  m-b-10">
                    <span className="text-muted m-r-5">Duration:</span>800
                  </h6>
                  <div className="progress">
                    <div
                      className="progress-bar progress-c-blue"
                      role="progressbar"
                      style={{ width: '70%', height: '6px' }}
                      aria-valuenow="70"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col> */}
        {/* <Col xl={4}>
          <Card className="card-social">
            <Card.Body className="border-bottom">
              <div className="row align-items-center justify-content-center">
                <div className="col-auto">
                  <i className="fab fa-google-plus-g text-c-red f-36" />
                </div>
                <div className="col text-right">
                  <h3>10,500</h3>
                  <h5 className="text-c-blue mb-0">
                    +5.9% <span className="text-muted">Total Likes</span>
                  </h5>
                </div>
              </div>
            </Card.Body>
            <Card.Body>
              <div className="row align-items-center justify-content-center card-active">
                <div className="col-6">
                  <h6 className="text-center m-b-10">
                    <span className="text-muted m-r-5">Target:</span>25,998
                  </h6>
                  <div className="progress">
                    <div
                      className="progress-bar progress-c-theme"
                      role="progressbar"
                      style={{ width: '80%', height: '6px' }}
                      aria-valuenow="80"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <h6 className="text-center  m-b-10">
                    <span className="text-muted m-r-5">Duration:</span>900
                  </h6>
                  <div className="progress">
                    <div
                      className="progress-bar progress-c-theme2"
                      role="progressbar"
                      style={{ width: '50%', height: '6px' }}
                      aria-valuenow="50"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col> */}
        {/* <Col md={6} xl={4}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Rating</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="row align-items-center justify-content-center m-b-20">
                <div className="col-6">
                  <h2 className="f-w-300 d-flex align-items-center float-left m-0">
                    4.7 <i className="fa fa-star f-10 m-l-10 text-c-yellow" />
                  </h2>
                </div>
                <div className="col-6">
                  <h6 className="d-flex  align-items-center float-right m-0">
                    0.4{' '}
                    <i className="fa fa-caret-up text-c-green f-22 m-l-10" />
                  </h6>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-12">
                  <h6 className="align-items-center float-left">
                    <i className="fa fa-star f-10 m-r-10 text-c-yellow" />5
                  </h6>
                  <h6 className="align-items-center float-right">384</h6>
                  <div
                    className="progress m-t-30 m-b-20"
                    style={{ height: '6px' }}
                  >
                    <div
                      className="progress-bar progress-c-theme"
                      role="progressbar"
                      style={{ width: '70%' }}
                      aria-valuenow="70"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>

                <div className="col-xl-12">
                  <h6 className="align-items-center float-left">
                    <i className="fa fa-star f-10 m-r-10 text-c-yellow" />4
                  </h6>
                  <h6 className="align-items-center float-right">145</h6>
                  <div
                    className="progress m-t-30  m-b-20"
                    style={{ height: '6px' }}
                  >
                    <div
                      className="progress-bar progress-c-theme"
                      role="progressbar"
                      style={{ width: '35%' }}
                      aria-valuenow="35"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>

                <div className="col-xl-12">
                  <h6 className="align-items-center float-left">
                    <i className="fa fa-star f-10 m-r-10 text-c-yellow" />3
                  </h6>
                  <h6 className="align-items-center float-right">24</h6>
                  <div
                    className="progress m-t-30  m-b-20"
                    style={{ height: '6px' }}
                  >
                    <div
                      className="progress-bar progress-c-theme"
                      role="progressbar"
                      style={{ width: '25%' }}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>

                <div className="col-xl-12">
                  <h6 className="align-items-center float-left">
                    <i className="fa fa-star f-10 m-r-10 text-c-yellow" />2
                  </h6>
                  <h6 className="align-items-center float-right">1</h6>
                  <div
                    className="progress m-t-30  m-b-20"
                    style={{ height: '6px' }}
                  >
                    <div
                      className="progress-bar progress-c-theme"
                      role="progressbar"
                      style={{ width: '10%' }}
                      aria-valuenow="10"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
                <div className="col-xl-12">
                  <h6 className="align-items-center float-left">
                    <i className="fa fa-star f-10 m-r-10 text-c-yellow" />1
                  </h6>
                  <h6 className="align-items-center float-right">0</h6>
                  <div
                    className="progress m-t-30  m-b-5"
                    style={{ height: '6px' }}
                  >
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: '0%' }}
                      aria-valuenow="0"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={8}>
          <Card className="Recent-Users">
            <Card.Header>
              <Card.Title as="h5">Recent Users</Card.Title>
            </Card.Header>
            <Card.Body className="px-0 py-2">
              <Table responsive hover>
                <tbody>
                  <tr className="unread">
                    <td>
                      <img
                        className="rounded-circle"
                        style={{ width: '40px' }}
                        src={avatar1}
                        alt="activity-user"
                      />
                    </td>
                    <td>
                      <h6 className="mb-1">Isabella Christensen</h6>
                      <p className="m-0">
                        Lorem Ipsum is simply dummy text of…
                      </p>
                    </td>
                    <td>
                      <h6 className="text-muted">
                        <i className="fa fa-circle text-c-green f-10 m-r-15" />
                        11 MAY 12:56
                      </h6>
                    </td>
                    <td>
                      <Link to="#" className="label theme-bg2 text-white f-12">
                        Reject
                      </Link>
                      <Link to="#" className="label theme-bg text-white f-12">
                        Approve
                      </Link>
                    </td>
                  </tr>
                  <tr className="unread">
                    <td>
                      <img
                        className="rounded-circle"
                        style={{ width: '40px' }}
                        src={avatar2}
                        alt="activity-user"
                      />
                    </td>
                    <td>
                      <h6 className="mb-1">Mathilde Andersen</h6>
                      <p className="m-0">
                        Lorem Ipsum is simply dummy text of…
                      </p>
                    </td>
                    <td>
                      <h6 className="text-muted">
                        <i className="fa fa-circle text-c-red f-10 m-r-15" />
                        11 MAY 10:35
                      </h6>
                    </td>
                    <td>
                      <Link to="#" className="label theme-bg2 text-white f-12">
                        Reject
                      </Link>
                      <Link to="#" className="label theme-bg text-white f-12">
                        Approve
                      </Link>
                    </td>
                  </tr>
                  <tr className="unread">
                    <td>
                      <img
                        className="rounded-circle"
                        style={{ width: '40px' }}
                        src={avatar3}
                        alt="activity-user"
                      />
                    </td>
                    <td>
                      <h6 className="mb-1">Karla Sorensen</h6>
                      <p className="m-0">
                        Lorem Ipsum is simply dummy text of…
                      </p>
                    </td>
                    <td>
                      <h6 className="text-muted">
                        <i className="fa fa-circle text-c-green f-10 m-r-15" />9
                        MAY 17:38
                      </h6>
                    </td>
                    <td>
                      <Link to="#" className="label theme-bg2 text-white f-12">
                        Reject
                      </Link>
                      <Link to="#" className="label theme-bg text-white f-12">
                        Approve
                      </Link>
                    </td>
                  </tr>
                  <tr className="unread">
                    <td>
                      <img
                        className="rounded-circle"
                        style={{ width: '40px' }}
                        src={avatar1}
                        alt="activity-user"
                      />
                    </td>
                    <td>
                      <h6 className="mb-1">Ida Jorgensen</h6>
                      <p className="m-0">
                        Lorem Ipsum is simply dummy text of…
                      </p>
                    </td>
                    <td>
                      <h6 className="text-muted f-w-300">
                        <i className="fa fa-circle text-c-red f-10 m-r-15" />
                        19 MAY 12:56
                      </h6>
                    </td>
                    <td>
                      <Link to="#" className="label theme-bg2 text-white f-12">
                        Reject
                      </Link>
                      <Link to="#" className="label theme-bg text-white f-12">
                        Approve
                      </Link>
                    </td>
                  </tr>
                  <tr className="unread">
                    <td>
                      <img
                        className="rounded-circle"
                        style={{ width: '40px' }}
                        src={avatar2}
                        alt="activity-user"
                      />
                    </td>
                    <td>
                      <h6 className="mb-1">Albert Andersen</h6>
                      <p className="m-0">
                        Lorem Ipsum is simply dummy text of…
                      </p>
                    </td>
                    <td>
                      <h6 className="text-muted">
                        <i className="fa fa-circle text-c-green f-10 m-r-15" />
                        21 July 12:56
                      </h6>
                    </td>
                    <td>
                      <Link to="#" className="label theme-bg2 text-white f-12">
                        Reject
                      </Link>
                      <Link to="#" className="label theme-bg text-white f-12">
                        Approve
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col> */}
      </Row>
    </React.Fragment>
  )
}

export default DashDefault
