import styled, { css } from 'styled-components'
import hexToRgba from '../../helpers/hexToRgba'
import colors from '../../styles/colors'

interface SimpleModalStylesProps {
  show: boolean
}

export const Container = styled.div<SimpleModalStylesProps>`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 112vw;
  height: 112vh;
  /* width: 100vw;
  height: 100vh; */

  background: ${hexToRgba(colors.black, 0.8)};
  opacity: 0;
  z-index: 0;
  visibility: hidden;
  transition: 0.3s;

  ${({ show }) =>
    show &&
    css`
      /* z-index: 2; */
      /* z-index: 99999999999999999999999999999999; */
      z-index: 9999999999;
      opacity: 1;
      visibility: visible;
    `}

  > div {
    background: #ffffff;
    box-shadow: 0px 2px 8px rgba(223, 210, 255, 0.15);
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    align-items: center;

    height: fit-content;

    padding: 32px;
    max-width: 90%;
    min-width: 33%;
    opacity: 1;
    z-index: 9999;

    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 90%;
    transition: 0.3s;
    transform: translate3d(0, -15px, 0);
    ${({ show }) =>
      show &&
      css`
        transform: translate3d(0, 0, 0);
      `}

    > span {
      position: fixed;
      top: 0px;
      right: 0px;
      padding: 16px;
      cursor: pointer;
    }
  }

  @media (max-width: 767px) {
    > div {
      margin: 0 24px;
    }
  }
`
