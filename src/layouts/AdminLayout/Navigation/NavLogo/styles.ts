import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const LinkStyled = styled(Link)`
  position: absolute;
  left: 54px;
  top: -9px;
  /* left: 69px;
  top: 24px; */
  > svg {
    width: 28px;
    height: 28px;
  }
  > svg path {
    fill: #a9b7d0;
  }
`
export const LinkStyledNotCollapseMenu = styled(Link)`
  position: absolute;
  left: 225px;
  transition: all 1s ease-in-out;
  top: 24px;
  > svg path {
    fill: #a9b7d0;
  }
`
