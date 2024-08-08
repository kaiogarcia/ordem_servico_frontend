import React, { useEffect, useState } from 'react'
import { ListGroup } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { BASENAME, BASE_TITLE } from '../../../config/constant'
import navigation from '../../../menu-items'

const Breadcrumb = () => {
  const [main, setMain] = useState([])
  const [item, setItem] = useState([])
  const layout = useSelector((store) => store.layout)

  useEffect(() => {
    navigation.items.map((item, index) => {
      if (item.type && item.type === 'group') {
        getCollapse(item, index)
      }
      return false
    })
  })

  const checkOutTitle = ({ title }) => {
    const pathName = document.location.pathname
    const sufixPath = ['/create', '/edit']
    sufixPath.forEach((item) => {
      if (pathName.includes(item)) {
        title = layout?.title
      }
    })
    window.localStorage.setItem('titlePageCurrent', JSON.stringify(title))
    return title
  }

  const getCollapse = (item, index) => {
    if (item.children) {
      item.children.filter((collapse) => {
        if (collapse.type && collapse.type === 'collapse') {
          getCollapse(collapse, index)
        } else if (collapse.type && collapse.type === 'item') {
          if (document.location.pathname === BASENAME + collapse.url) {
            setMain(item)
            setItem(collapse)
          }
        }
        return false
      })
    }
  }

  let mainContent, itemContent
  let breadcrumbContent = ''
  let title = ''

  if (main && main.type === 'collapse') {
    mainContent = (
      <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
        <Link to="#">{main.title}</Link>
      </ListGroup.Item>
    )
  }

  if (item && item.type === 'item') {
    title = item.title
    itemContent = (
      <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
        <Link to="#">{title}</Link>
      </ListGroup.Item>
    )

    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <div className="page-header">
          <div className="page-block">
            <div className="row align-items-center">
              <div className="col-md-12">
                {/* <div className="page-header-title">
                  <h5 className="m-b-10">
                    <span style={{ fontSize: '25px', fontWeight: 700 }}>
                      {checkOutTitle({ title })}
                    </span>
                  </h5>
                </div> */}
                {/* <ListGroup as="ul" bsPrefix=" " className="breadcrumb">
                  <ListGroup.Item
                    as="li"
                    bsPrefix=" "
                    className="breadcrumb-item"
                  >
                    <Link to="/">
                      <i className="feather icon-home" />
                    </Link>
                  </ListGroup.Item>
                  {mainContent}
                  {itemContent}
                </ListGroup> */}
              </div>
            </div>
          </div>
        </div>
      )
    }

    document.title = title + BASE_TITLE
  }

  return <React.Fragment>{breadcrumbContent}</React.Fragment>
}

export default Breadcrumb
