import React, { useEffect, useState } from 'react'
import { ListGroup, Dropdown } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { BASENAME } from 'src/config/constant'

import useWindowSize from '../../../../hooks/useWindowSize'
import navigation from '../../../../menu-items'
import NavSearch from './NavSearch'
import { TitlePage } from './style'

const NavLeft = () => {
  const windowSize = useWindowSize()

  let dropdownRightAlign = false

  let navItemClass = ['nav-item']
  if (windowSize.width <= 575) {
    navItemClass = [...navItemClass, 'd-none']
  }

  const titlePage = JSON.parse(window.localStorage.getItem('titlePageCurrent'))
  const [item, setItem] = useState([])
  const layout = useSelector((store) => store.layout)

  const getCollapse = (item, index) => {
    if (item.children) {
      item.children.filter((collapse) => {
        if (collapse.type && collapse.type === 'collapse') {
          getCollapse(collapse, index)
        } else if (collapse.type && collapse.type === 'item') {
          if (document.location.pathname === BASENAME + collapse.url) {
            setItem(collapse)
          }
        }
        return false
      })
    }
  }

  useEffect(() => {
    navigation?.items?.map((item, index) => {
      if (item.type && item.type === 'group') {
        getCollapse(item, index)
      }
      return false
    })
  })

  const checkOutTitle = ({ title }) => {
    const pathName = document.location.pathname
    const sufixPath = [
      '/novo',
      '/editar',
      '/nova',
      '/dashboard',
      '/ordem-servico',
    ]
    sufixPath.forEach((item) => {
      if (pathName.includes(item)) {
        let pageName = ''
        if (String(item).replace('/', '') === 'ordem-servico') {
          title = 'Gestão O.S/Orçamento'
        } else if (
          String(item).replace('/', '') === 'novo' ||
          String(item).replace('/', '') === 'nova'
        ) {
          pageName = 'Inclusão'
          title = title + ' - ' + pageName
        } else if (String(item).replace('/', '') === 'dashboard') {
          pageName = 'Dashboard'
          title = pageName
        } else {
          pageName = 'Edição'
          title = title + ' - ' + pageName
        }
      }
    })
    if (pathName.includes('/ordem-servicos')) {
      title = 'Gestão O.S/Orçamento'
    }
    return title
  }

  return (
    <React.Fragment>
      {/* {!!titlePage && (
        )} */}
      <TitlePage>{checkOutTitle({ title: item.title })}</TitlePage>
      {/* <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
                <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')}>
                    <Dropdown alignRight={dropdownRightAlign}>
                        <Dropdown.Toggle variant={'link'} id="dropdown-basic">
                            Dropdown
                        </Dropdown.Toggle>
                        <ul>
                            <Dropdown.Menu>
                                <li>
                                    <Link to="#" className="dropdown-item">
                                        Action
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="dropdown-item">
                                        Another action
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="dropdown-item">
                                        Something else here
                                    </Link>
                                </li>
                            </Dropdown.Menu>
                        </ul>
                    </Dropdown>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
                    <NavSearch windowWidth={windowSize.width} />
                </ListGroup.Item>
            </ListGroup> */}
    </React.Fragment>
  )
}

export default NavLeft
