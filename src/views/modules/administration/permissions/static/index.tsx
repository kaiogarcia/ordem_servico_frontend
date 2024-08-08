import PaidIcon from '@mui/icons-material/Paid'
import DashboardIcon from '@mui/icons-material/Dashboard';
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import GroupIcon from '@mui/icons-material/Group'
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { CLIENTES_EDITAR, CLIENTES_EXCLUIR, CLIENTES_INCLUIR, CLIENTES_VISUALIZAR, CONFIGURATION_VISUALIZAR, DASHBOARD, DESPESAS_EDITAR, DESPESAS_EXCLUIR, DESPESAS_INCLUIR, DESPESAS_VISUALIZAR, EQUIPAMENTOS_EDITAR, EQUIPAMENTOS_EXCLUIR, EQUIPAMENTOS_INCLUIR, EQUIPAMENTOS_VISUALIZAR, GESTAO_USUARIOS_BLOQUEAR, GESTAO_USUARIOS_EDITAR, GESTAO_USUARIOS_INCLUIR, GESTAO_USUARIOS_VISUALIZAR, ORDEM_SERVICO_EDITAR, ORDEM_SERVICO_EXCLUIR, ORDEM_SERVICO_INCLUIR, ORDEM_SERVICO_VISUALIZAR, PECAS_EDITAR, PECAS_EXCLUIR, PECAS_INCLUIR, PECAS_VISUALIZAR, RECEITAS_EDITAR, RECEITAS_EXCLUIR, RECEITAS_VISUALIZAR, SERVICOS_EDITAR, SERVICOS_EXCLUIR, SERVICOS_INCLUIR, SERVICOS_VISUALIZAR } from './keysPermissions';

export const permissionsUser = [
  {
    name: 'DASHBOARD',
    key: DASHBOARD,
    icon: <DashboardIcon />
  },
  {
    name: 'ORDEM DE SERVIÇO (VISUALIZAR)',
    key: ORDEM_SERVICO_VISUALIZAR,
    icon: <ContentPasteIcon />,
  },
  {
    name: 'ORDEM DE SERVIÇO (INCLUIR)',
    key: ORDEM_SERVICO_INCLUIR,
    icon: <ContentPasteIcon />,
  },
  {
    name: 'ORDEM DE SERVIÇO (EDITAR)',
    key: ORDEM_SERVICO_EDITAR,
    icon: <ContentPasteIcon />,
  },
  {
    name: 'ORDEM DE SERVIÇO (EXCLUIR)',
    key: ORDEM_SERVICO_EXCLUIR,
    icon: <ContentPasteIcon />,
  },
  {
    name: 'RECEITAS (VISUALIZAR)',
    key: RECEITAS_VISUALIZAR,
    icon: <PaidIcon />,
  },
  {
    name: 'RECEITAS (EDITAR)',
    key: RECEITAS_EDITAR,
    icon: <PaidIcon />,
  },
  {
    name: 'RECEITAS (EXCLUIR)',
    key: RECEITAS_EXCLUIR,
    icon: <PaidIcon />,
  },
  {
    name: 'DESPESAS (VISUALIZAR)',
    key: DESPESAS_VISUALIZAR,
    icon: <MoneyOffIcon />,
  },
  {
    name: 'DESPESAS (INCLUIR)',
    key: DESPESAS_INCLUIR,
    icon: <MoneyOffIcon />,
  },
  {
    name: 'DESPESAS (EDITAR)',
    key: DESPESAS_EDITAR,
    icon: <MoneyOffIcon />,
  },
  {
    name: 'DESPESAS (EXCLUIR)',
    key: DESPESAS_EXCLUIR,
    icon: <MoneyOffIcon />,
  },
  {
    name: 'CLIENTES (VISUALIZAR)',
    key: CLIENTES_VISUALIZAR,
    icon: <GroupIcon />,
  },
  {
    name: 'CLIENTES (INCLUIR)',
    key: CLIENTES_INCLUIR,
    icon: <GroupIcon />,
  },
  {
    name: 'CLIENTES (EDITAR)',
    key: CLIENTES_EDITAR,
    icon: <GroupIcon />,
  },
  {
    name: 'CLIENTES (EXCLUIR)',
    key: CLIENTES_EXCLUIR,
    icon: <GroupIcon />,
  },
  {
    name: 'PEÇAS (VISUALIZAR)',
    key: PECAS_VISUALIZAR,
    icon: <HomeRepairServiceIcon />,
  },
  {
    name: 'PEÇAS (INCLUIR)',
    key: PECAS_INCLUIR,
    icon: <HomeRepairServiceIcon />,
  },
  {
    name: 'PEÇAS (EDITAR)',
    key: PECAS_EDITAR,
    icon: <HomeRepairServiceIcon />,
  },
  {
    name: 'PEÇAS (EXCLUIR)',
    key: PECAS_EXCLUIR,
    icon: <HomeRepairServiceIcon />,
  },
  {
    name: 'SERVIÇOS (VISUALIZAR)',
    key: SERVICOS_VISUALIZAR,
    icon: <ManageAccountsIcon />,
  },
  {
    name: 'SERVIÇOS (INCLUIR)',
    key: SERVICOS_INCLUIR,
    icon: <ManageAccountsIcon />,
  },
  {
    name: 'SERVIÇOS (EDITAR)',
    key: SERVICOS_EDITAR,
    icon: <ManageAccountsIcon />,
  },
  {
    name: 'SERVIÇOS (EXCLUIR)',
    key: SERVICOS_EXCLUIR,
    icon: <ManageAccountsIcon />,
  },
  {
    name: 'EQUIPAMENTOS (VISUALIZAR)',
    key: EQUIPAMENTOS_VISUALIZAR,
    icon: <ImportantDevicesIcon />,
  },
  {
    name: 'EQUIPAMENTOS (INCLUIR)',
    key: EQUIPAMENTOS_INCLUIR,
    icon: <ImportantDevicesIcon />,
  },
  {
    name: 'EQUIPAMENTOS (EDITAR)',
    key: EQUIPAMENTOS_EDITAR,
    icon: <ImportantDevicesIcon />,
  },
  {
    name: 'EQUIPAMENTOS (EXCLUIR)',
    key: EQUIPAMENTOS_EXCLUIR,
    icon: <ImportantDevicesIcon />,
  },
  {
    name: 'GESTÃO DE USUÁRIOS (VISUALIZAR)',
    key: GESTAO_USUARIOS_VISUALIZAR,
    icon: <GroupAddIcon />,
  },
  {
    name: 'GESTÃO DE USUÁRIOS (INCLUIR)',
    key: GESTAO_USUARIOS_INCLUIR,
    icon: <GroupAddIcon />,
  },
  {
    name: 'GESTÃO DE USUÁRIOS (EDITAR)',
    key: GESTAO_USUARIOS_EDITAR,
    icon: <GroupAddIcon />,
  },
  {
    name: 'GESTÃO DE USUÁRIOS (BLOQUEAR)',
    key: GESTAO_USUARIOS_BLOQUEAR,
    icon: <GroupAddIcon />,
  },
  {
    name: 'CONFIGURAÇÕES (VISUALIZAR)',
    key: CONFIGURATION_VISUALIZAR,
    icon: <CreditCardIcon />,
  },
]