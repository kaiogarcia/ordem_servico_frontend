/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import useLocalStorage from 'use-local-storage'
import ServiceOrder from '../../serviceOrder'
import { OSData } from '../../serviceOrder/create/type'
import { Modal } from './style'

type ModalPDFProps = {
  oSData: OSData[]
}

export const ModalPDF: React.FC<ModalPDFProps> = ({ oSData }) => {
  const [_, setOsDataAdded] = useLocalStorage<OSData[]>(
    'osDataAdded',
    [] as OSData[],
  )
  return (
    <Modal>
      {oSData?.map((item, index) => (
        <ServiceOrder
          osData={item}
          key={index}
          isMerge={oSData.length > 1}
          setOsDataAdded={setOsDataAdded}
        />
      ))}
    </Modal>
  )
}
