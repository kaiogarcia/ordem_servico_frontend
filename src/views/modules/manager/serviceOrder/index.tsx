/* eslint-disable no-restricted-globals */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import BackIcon from '@mui/icons-material/Reply'
import Fab from '@mui/material/Fab'
import { format } from 'date-fns'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { formatInputPrice, formatPrice } from 'src/helpers/formatPrice'
import { useGeneratePDF } from 'src/hooks/useGeneratePDF'
import { MANAGER_SERVICE_ORDER } from 'src/layouts/typePath'
import { useAdmin } from 'src/services/useAdmin'
import { Row } from 'src/styles'
import Logo from './assets/images/logo.png'
import emailIcon from '../../../../assets/images/os/os_email.jpg'
import logoIcon from '../../../../assets/images/os/os_logo.png'
import peopleIcon from '../../../../assets/images/os/os_people.jpg'
import phoneIcon from '../../../../assets/images/os/os_phone.jpg'
import socialIcon from '../../../../assets/images/os/os_social.jpg'
import Signature from './assets/images/signature.png'
import { Laudo } from './create/tables/type'
import { ItemPieces, ItemServices, OSData } from './create/type'
import {
  ButtonContainerGenerateOS,
  ButtonContainerLaunchInTheFinancial,
  CompanyContact,
  Container,
  ContainerDateOS,
  ContainerOS,
  ContainerOSNumberAndDate,
  ContainerOSText,
  DateOS,
  Header,
  HeaderText,
  HeaderTextFont,
  Image,
  OSNumber,
  OSText,
  PaperStyled,
  TecnicalResponsible,
  Text,
} from './style'

type ServiceOrderProps = {
  osData?: OSData
  setOsDataAdded?: React.Dispatch<React.SetStateAction<OSData[]>>
  isMerge?: boolean
}

const ServiceOrder: React.FC<ServiceOrderProps> = ({
  osData,
  setOsDataAdded,
  isMerge = false,
}) => {
  const exportPDF = useGeneratePDF()
  const history = useHistory()
  // const location = useLocation()
  const location = history?.location
  const { apiAdmin } = useAdmin()
  const [data, setData] = useState<OSData>(osData)
  const [isOSGenerated, setIsOsGenerated] = useState(false)

  // const osData = useData()

  // const updateData = (osData: any) => {
  //   if (osData?.length) {
  //     osData.map((item) => {
  //       setData(item)
  //     })
  //   }
  //   if (!osData) {
  //     setData(location?.state?.oSData)
  //   }
  // }

  function formatarNumeroEmReais(numeroString: string): string {
    // Extrair apenas os dígitos e o ponto decimal
    const numeros = numeroString.match(/\d|\./g)

    if (!numeros) {
      // Retornar string vazia se não houver dígitos
      return ''
    }

    // Juntar os dígitos em uma única string
    const numeroLimpo = numeros.join('')

    // Dividir a parte inteira e a parte decimal
    const partes = numeroLimpo.split('.')

    // Corrigir o formato da parte inteira
    const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')

    // Construir a string formatada
    const numeroFormatado = `R$ ${parteInteira}${
      partes[1] ? ',' + partes[1] : ',00'
    }`

    return numeroFormatado
  }

  React.useEffect(() => {
    if (!osData) {
      const data: OSData = location?.state?.oSData
      setData({
        ...data,
        discount: data?.discount?.includes('R$')
          ? formatarNumeroEmReais(data?.discount)
          : data?.discount,
      })
    } else {
      setTimeout(async () => {
        await handleClickToGenerateOS()
        if (setOsDataAdded) {
          setOsDataAdded((previousState) => [
            ...previousState,
            {
              ...osData,
              discount: osData?.discount?.includes('R$')
                ? formatarNumeroEmReais(osData?.discount)
                : osData.discount,
            },
          ])
        }
      }, 2000)
    }
  }, [osData])

  React.useEffect(() => {
    scroll(0, 0)
    return () => {
      window.localStorage.removeItem('data')
    }
  }, [])

  const getCurrentDateAndHour = () => {
    const now = new Date()
    return format(now, 'dd/MM/yyyy HH:mm')
  }

  // const updateDateOSGenerated = async () => {
  //   try {
  //     await apiAdmin.put(`orderServices/${data?._id}`, {
  //       dateGeneratedOS: getCurrentDateAndHour(),
  //     })
  //   } catch (error) {
  //     toast.error(
  //       'Um erro ocorreu ao tentar atualizar a data de atualização da OS gerada.',
  //     )
  //   }
  // }

  // React.useEffect(() => {
  //   if (!osData) {
  //     handleClickToGenerateOS()
  //   }
  // }, [data])

  const handleClickToGenerateOS = async () => {
    exportPDF(
      `Cliente_${data?.client.name}_Ordem_de_Servico_N_${data?.osNumber}_NSerie_${data?.serialNumber}`,
      `pdf${data?._id}`,
      'open_new_window',
      osData ? false : true,
      data?.client.name,
      data?.status,
      data?.typeDocument, //ORCAMENTO OU ORDEM_DE_SERVICO
      data?._id,
      data?.client?.id,
      isMerge,
    )
    setIsOsGenerated(true)
    // await updateDateOSGenerated()
  }

  const resultNewArray = (data: any[], lengthTotal?: number) => {
    const length = lengthTotal ? lengthTotal : 6
    if (data?.length) {
      const lengthData = length - data?.length
      if (lengthData < length) {
        return [...data, ...new Array(lengthData).fill('')]
      } else {
        return data
      }
    } else {
      return [...new Array(length).fill('')]
    }
  }

  const resultRowItemServices = (data: any[]): ItemServices[] => {
    return resultNewArray(data, 8)
  }

  const resultRowLaudos = (data: any[]): Laudo[] => {
    return resultNewArray(data, 9)
  }

  const resultRowItemPieces = (data: any[]): ItemPieces[] => {
    return resultNewArray(data)
  }

  return (
    <>
      <ButtonContainerLaunchInTheFinancial isGeneratePDF={!!osData}>
        <Fab
          color="secondary"
          variant="extended"
          onClick={() => handleClickToGenerateOS()}
        >
          <CloudDownloadIcon sx={{ mr: 1 }} />
          Baixar PDF
        </Fab>
      </ButtonContainerLaunchInTheFinancial>
      <ButtonContainerGenerateOS isGeneratePDF={!!osData}>
        <Fab
          color="primary"
          variant="extended"
          onClick={() => history.push(MANAGER_SERVICE_ORDER)}
        >
          <BackIcon sx={{ mr: 1 }} />
          Voltar
        </Fab>
      </ButtonContainerGenerateOS>
      <Container isGeneratePDF={!!osData}>
        <ContainerOS id={`pdf${data?._id}`}>
          <PaperStyled elevation={1}>
            <Header>
              <CompanyContact alignItems="flex-start">
                <HeaderTextFont
                  fontSize={13}
                  display="flex"
                  alignItems="center"
                  gap="5px"
                >
                  <b>Av. Niemeyer Qd. 157 Lt 24</b>{' '}
                </HeaderTextFont>
                <HeaderTextFont
                  fontSize={13}
                  display="flex"
                  alignItems="center"
                  gap="5px"
                >
                  <b>CNPJ: 46.293.911/0001-55</b>{' '}
                </HeaderTextFont>
                <HeaderTextFont
                  fontSize={13}
                  display="flex"
                  alignItems="center"
                  gap="5px"
                  width= '300px'
                >
                  <b style={{ width: '300px' }}>Assistência Técnica Autorizada</b>{' '}
                </HeaderTextFont>
              </CompanyContact>
              <HeaderTextFont position='relative'>
                <Image src={logoIcon} width="206px" position='absolute' right='-51px' top='-15px'/>
                {/* <HeaderText>
                  <HeaderTextFont marginLeft="5px" fontSize={10}>
                    ASSISTÊNCIA TÉCNICA AUTORIZADA
                  </HeaderTextFont>
                </HeaderText> */}
              </HeaderTextFont>
              <CompanyContact>
                <HeaderTextFont
                  fontSize={13}
                  display="flex"
                  alignItems="center"
                  gap="5px"
                >
                  <b>(62) 3222-6069 (62) 98529-6795</b>{' '}
                  <Image width="21px" src={phoneIcon} />
                </HeaderTextFont>
                <HeaderTextFont
                  fontSize={13}
                  display="flex"
                  alignItems="center"
                  gap="5px"
                >
                  <b>slevandosolucao@gmail.com</b>{' '}
                  <Image width="21px" src={emailIcon} />
                </HeaderTextFont>
                <HeaderTextFont
                  fontSize={13}
                  display="flex"
                  alignItems="center"
                  gap="5px"
                >
                  <b>@solutionprestadoradeservico</b>{' '}
                  <Image width="21px" src={peopleIcon} />
                </HeaderTextFont>
              </CompanyContact>
            </Header>
          </PaperStyled>

          <ContainerOSNumberAndDate>
            <PaperStyled elevation={1}>
              <ContainerOSText>
                <OSText>
                  {data?.typeDocument === 'ORCAMENTO'
                    ? 'ORÇAMENTO'
                    : 'ORDEM DE SERVIÇO'}
                </OSText>
                <OSNumber>
                  Nº <OSNumber color="red">{data?.osNumber}</OSNumber>
                </OSNumber>
              </ContainerOSText>
            </PaperStyled>
            <PaperStyled elevation={1}>
              <ContainerDateOS>
                <DateOS>Data {data?.dateOS}</DateOS>
              </ContainerDateOS>
            </PaperStyled>
          </ContainerOSNumberAndDate>

          <PaperStyled elevation={1}>
            <Row
              borderBottom="1px solid gray"
              marginLeft="15px"
              marginRight="15px"
              marginBottom="5px"
            >
              <Text isNotUsingBorderBottom width="900px">
                <b>Cliente:</b> {data?.client.name}
              </Text>
            </Row>
            <Row marginLeft="15px" columns="5fr 1fr" marginBottom="5px">
              <Text>
                <b>Endereço:</b> {data?.client.address}
              </Text>
              <Text marginRight="15px">
                <b>CEP:</b> {data?.client.cep}
              </Text>
            </Row>
            <Row
              marginLeft="15px"
              marginRight="15px"
              columns="3fr 1fr 2fr"
              marginBottom="5px"
            >
              <Text>
                <b>Cidade:</b> {data?.client.city}
              </Text>
              <Text>
                <b>UF:</b> {data?.client.uf}
              </Text>
              <Text>
                <b>CNPJ:</b> {data?.client.cpfOrCnpj}
              </Text>
            </Row>
            <Row marginLeft="15px" columns="2fr 1fr" marginBottom="5px">
              <Text>
                <b>E-mail:</b> {data?.client.email}
              </Text>
              <Text marginRight="15px">
                <b>Telefone:</b> {data?.client.phoneNumber}{' '}
                {data?.client.phoneNumberFixo
                  ? `${data?.client.phoneNumberFixo}`
                  : null}
              </Text>
            </Row>
          </PaperStyled>
          <PaperStyled elevation={1}>
            <Row marginLeft="15px" columns="repeat(4, 1fr)" marginBottom="5px">
              <Text>
                <b>Equipamento:</b> {data?.equipament}
              </Text>
              <Text marginRight="15px">
                <b>Marca:</b> {data?.brand}
              </Text>
              <Text marginRight="15px">
                <b>Modelo:</b> {data?.model}
              </Text>
              <Text marginRight="15px">
                <b>Nº Série:</b> {data?.serialNumber}
              </Text>
            </Row>
            <Row marginLeft="15px" columns="repeat(4, 1fr)" marginBottom="5px">
              <Text>
                <b>Cabo:</b> {data?.cable}
              </Text>
              <Text marginRight="15px">
                <b>Carregador:</b> {data?.charger}
              </Text>
              <Text marginRight="15px">
                <b>Quabrado:</b> {data?.breaked}
              </Text>
              <Text marginRight="15px">
                <b>Detalhes:</b> {data?.detail}
              </Text>
            </Row>
          </PaperStyled>
          {!!resultRowItemServices(data?.itemServices)?.length && (
            <PaperStyled elevation={1} paddingBottom="20px">
              <Row
                columns="8fr 1fr 1fr 1fr"
                gap={5}
                marginLeft="15px"
                marginRight="15px"
                marginBottom="-16px"
              >
                <Text isNotUsingBorderBottom fontWeight="bold">
                  Executados
                </Text>
                <Text
                  isNotUsingBorderBottom
                  display="flex"
                  justifyContent="center"
                  fontWeight="bold"
                >
                  Quantidade
                </Text>
                <Text
                  isNotUsingBorderBottom
                  display="flex"
                  justifyContent="center"
                  fontWeight="bold"
                >
                  Unidade
                </Text>
                <Text
                  display="flex"
                  isNotUsingBorderBottom
                  fontWeight="bold"
                  justifyContent="center"
                >
                  Total
                </Text>
              </Row>
              {resultRowItemServices(data?.itemServices).map((item) => {
                return (
                  <Row
                    columns="8fr 1fr 1fr 1fr"
                    marginLeft="15px"
                    marginRight="15px"
                    height="27px"
                    gap={5}
                  >
                    <Text marginTop="20px" height="19px">
                      {item.description}
                    </Text>
                    <Text
                      marginTop="20px"
                      height="19px"
                      display="flex"
                      justifyContent="center"
                    >
                      {item.qtde}
                    </Text>
                    <Text
                      marginTop="20px"
                      height="19px"
                      display="flex"
                      justifyContent="center"
                    >
                      {!!item.unit && formatPrice(item.unit)}
                    </Text>
                    <Text
                      marginTop="20px"
                      height="19px"
                      justifyContent="center"
                      display="flex"
                    >
                      {!!item.total && formatPrice(item.total)}
                    </Text>
                  </Row>
                )
              })}
            </PaperStyled>
          )}
          {!!resultRowLaudos(data?.laudos)?.length && (
            <PaperStyled elevation={1} paddingBottom="20px">
              <Text
                marginLeft="15px"
                isNotUsingBorderBottom
                fontWeight="bold"
                marginBottom="-16px"
              >
                Laudo Técnico
              </Text>
              {resultRowLaudos(data?.laudos).map((item) => {
                return (
                  <Row columns="8fr" marginLeft="15px" height="27px">
                    <Text marginTop="20px" height="19px" marginRight="15px">
                      {item.description}
                    </Text>
                  </Row>
                )
              })}
            </PaperStyled>
          )}
          {!!resultRowItemPieces(data?.itemPieces)?.length && (
            <PaperStyled elevation={1} paddingBottom="20px">
              <Row
                columns="8fr 1fr 1fr 1fr"
                gap={5}
                marginLeft="15px"
                marginRight="15px"
                marginBottom="-16px"
              >
                <Text isNotUsingBorderBottom fontWeight="bold">
                  Peças
                </Text>
                <Text
                  isNotUsingBorderBottom
                  display="flex"
                  justifyContent="center"
                  fontWeight="bold"
                >
                  Quantidade
                </Text>
                <Text
                  isNotUsingBorderBottom
                  display="flex"
                  fontWeight="bold"
                  justifyContent="center"
                >
                  Unidade
                </Text>
                <Text
                  isNotUsingBorderBottom
                  fontWeight="bold"
                  justifyContent="center"
                  display="flex"
                >
                  Total
                </Text>
              </Row>
              {resultRowItemPieces(data?.itemPieces).map((item) => {
                return (
                  <Row
                    columns="8fr 1fr 1fr 1fr"
                    marginLeft="15px"
                    marginRight="15px"
                    height="27px"
                    gap={5}
                  >
                    <Text marginTop="20px" height="19px">
                      {item.description}
                    </Text>
                    <Text
                      marginTop="20px"
                      height="19px"
                      display="flex"
                      justifyContent="center"
                    >
                      {item.qtde}
                    </Text>
                    <Text
                      marginTop="20px"
                      height="19px"
                      display="flex"
                      justifyContent="center"
                    >
                      {!!item.unit && formatPrice(item.unit)}
                    </Text>
                    <Text
                      marginTop="20px"
                      height="19px"
                      display="flex"
                      justifyContent="center"
                    >
                      {!!item.total && formatPrice(item.total)}
                    </Text>
                  </Row>
                )
              })}
            </PaperStyled>
          )}
          <Row columns="repeat(2, 1fr)" gap={5}>
            <PaperStyled
              elevation={1}
              display="flex"
              justifyContent="center"
              fontSize="17px"
              flexDirection="column"
              alignItems="center"
              isParcialValue={!!data?.valuePartial}
            >
              {!!data?.discount && (
                <Text
                  isNotUsingBorderBottom
                  fontSize="11px"
                  display="flex"
                  gap="5px"
                  width="228px"
                  justifyContent="right"
                  isParcialValue={!!data?.valuePartial}
                >
                  <b>Desconto: </b>{' '}
                  <span style={{ width: '100px' }}>{data?.discount}</span>
                </Text>
              )}
              <Text
                isNotUsingBorderBottom
                fontSize="11px"
                display="flex"
                width="228px"
                justifyContent="right"
                isParcialValue={!!data?.valuePartial}
              >
                <b>Mão De Obra: </b>{' '}
                <span style={{ width: '100px', marginLeft: '5px' }}>
                  {data?.manpower}
                </span>
              </Text>
            </PaperStyled>
            <PaperStyled
              elevation={1}
              display="flex"
              justifyContent="center"
              fontSize="17px"
              flexDirection="column"
              alignItems="center"
              isParcialValue={!!data?.valuePartial}
            >
              {!!data?.subTotal && (
                <Text
                  marginRight="15px"
                  isNotUsingBorderBottom
                  fontSize="11px"
                  display="flex"
                  gap="5px"
                  isParcialValue={!!data?.valuePartial}
                >
                  <b>
                    {!!data?.valuePartial
                      ? 'Valor Sem Desconto'
                      : 'Valor S/Desconto:'}{' '}
                  </b>{' '}
                  <span>{data?.subTotal}</span>
                </Text>
              )}
              {!!data?.valuePartial && (
                <Text
                  marginRight="15px"
                  isNotUsingBorderBottom
                  fontSize="11px"
                  display="flex"
                  gap="5px"
                  justifyContent="center"
                  isParcialValue={!!data?.valuePartial}
                  width={!!data?.valuePartial ? '' : '225px'}
                >
                  <b>{!!data?.valuePartial ? 'Valor Pago' : 'Valor Pago:'} </b>{' '}
                  <span>{data?.valuePartial}</span>
                </Text>
              )}
              <Text
                marginRight="-20px"
                width="225px"
                isNotUsingBorderBottom
                display="flex"
                isParcialValue={!!data?.valuePartial}
              >
                <b>
                  {!!data?.valuePartial ? 'Total A Pagar' : 'Total A Pagar:'}{' '}
                </b>{' '}
                {data?.status === 'PENDENTE' && data?.remainingValue
                  ? data?.remainingValue
                  : data?.total}
              </Text>
            </PaperStyled>
          </Row>
          <PaperStyled elevation={1} padding="5px 40px 0px 40px" isNotUseBorder>
            <Row
              marginLeft="15px"
              columns="repeat(2, 1fr)"
              marginBottom="5px"
              marginTop="150px"
            >
              <Text
                isNotUsingBorderBottom
                display="flex"
                justifyContent="center"
                position="relative"
                bottom="60px"
              >
                <Image src={Signature} />
                <TecnicalResponsible>Técnico Responsável</TecnicalResponsible>
              </Text>
              <Text
                isNotUsingBorderBottom
                borderTop="1px solid gray"
                display="flex"
                justifyContent="center"
                position="relative"
                bottom="60px"
              >
                <b
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  Cliente
                </b>
              </Text>
            </Row>
          </PaperStyled>
        </ContainerOS>
      </Container>
    </>
  )
}

export default ServiceOrder
