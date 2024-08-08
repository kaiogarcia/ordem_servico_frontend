import React, { useContext, useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import { NavLink, useHistory } from 'react-router-dom'
import NavIcon from '../NavIcon'
import NavBadge from '../NavBadge'

import { ConfigContext } from '../../../../../contexts/ConfigContext'
import * as actionType from '../../../../../store/actions'
import useWindowSize from '../../../../../hooks/useWindowSize'
/** Material UI */
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { toast } from 'src/components/Widgets/Toastify'
import { useModal } from 'src/hooks/useModal'

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    // backgroundColor: theme.palette.common.white,
    backgroundColor: '#3f4d67',
    // color: 'rgba(0, 0, 0, 0.87)',
    color: '#FFF',
    boxShadow: theme.shadows[1],
    fontSize: 11,
    position: 'relative',
    right: '100px',
    bottom: '20px',
  },
}))

function extrairParteDaString({ path }) {
  if (!path || path.trim() === '') {
    return path
  }

  const partes = path.split('/')

  // Remove o último elemento vazio, caso exista
  if (partes[partes.length - 1] === '') {
    partes.pop()
  }

  // Verifica se há pelo menos dois elementos no array
  if (partes.length >= 2) {
    return '/' + partes.slice(1, 2).join('/')
  }

  // Retorna a string original caso não haja pelo menos dois elementos
  return path
}

function CustomNavLink({
  to,
  urlPathName,
  className,
  exact,
  target,
  isHasModificationFields,
  children,
}) {
  const history = useHistory()

  const handleClick = (e) => {
    e.preventDefault()
    if (urlPathName) {
      if (isHasModificationFields) {
        toast.warning(
          'Atenção, necessário clicar no botão Salvar para registrar o dados.',
        )
      } else {
        history.push(to)
      }
    } else {
      history.push(to)
    }
  }

  return (
    <a href={to} className={className} onClick={handleClick} target={target}>
      {children}
    </a>
  )
}

const NavItem = ({ layout, item }) => {
  const layoutState = useSelector((state) => state.layout)
  const windowSize = useWindowSize()
  const configContext = useContext(ConfigContext)
  const { dispatch } = configContext

  let itemTitle = item.title
  if (item.icon) {
    itemTitle = <span className="pcoded-mtext">{item.title}</span>
  }

  let itemTarget = ''
  if (item.target) {
    itemTarget = '_blank'
  }

  let subContent
  if (item.external) {
    subContent = (
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        <NavIcon items={item} />
        {itemTitle}
        <NavBadge items={item} />
      </a>
    )
  } else {
    const { url, fields } = layoutState
    if (url) {
      if (String(item.url).includes(extrairParteDaString({ path: url }))) {
        // console.log({ urlPathName: urlPathName.url, to: item.url })
      }
    }

    subContent = (
      <CustomNavLink
        to={item.url}
        urlPathName={url}
        className="nav-link"
        exact={true}
        target={itemTarget}
        isHasModificationFields={Object.values(fields).some((field) => field)}
      >
        <NavIcon items={item} />
        {itemTitle}
        {/* <NavBadge items={item} /> */}
      </CustomNavLink>
    )
  }
  let mainContent = ''
  if (layout === 'horizontal') {
    mainContent = (
      <ListGroup.Item
        as="li"
        bsPrefix=" "
        onClick={() => dispatch({ type: actionType.NAV_CONTENT_LEAVE })}
      >
        {subContent}
      </ListGroup.Item>
    )
  } else {
    if (windowSize.width < 992) {
      mainContent = (
        <ListGroup.Item
          as="li"
          bsPrefix=" "
          className={item.classes}
          onClick={() => dispatch({ type: actionType.COLLAPSE_MENU })}
        >
          {subContent}
        </ListGroup.Item>
      )
    } else {
      mainContent = (
        <LightTooltip placement="right" title={itemTitle}>
          <ListGroup.Item as="li" bsPrefix=" " className={item.classes}>
            {subContent}
          </ListGroup.Item>
        </LightTooltip>
      )
    }
  }

  return <React.Fragment>{mainContent}</React.Fragment>
}

export default NavItem
