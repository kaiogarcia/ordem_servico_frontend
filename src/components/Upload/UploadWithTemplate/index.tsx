
import { Alert } from '@mui/material';
import { FileUpload, FileUploadErrorEvent } from 'primereact/fileupload';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'src/components/Widgets/Toastify';
import { LAYOUT_MAKE_REQUEST } from 'src/store/actions';

interface UploadWithTemplateProps {
  accept?: AcceptType
  endpoint: string
  disabled?: boolean
  multiple?: boolean
  call?: () => Promise<void>
  otherCall?: () => Promise<void>
  closeModal?: () => void
}

type AcceptType = '.pdf' | 'video/*' | 'audio/*' | 'image/jpeg, image/png' | 'image/*' | '.csv'

export const UploadWithTemplate: React.FC<UploadWithTemplateProps> = ({ accept = '.pdf', endpoint, multiple = false, call, closeModal, otherCall, disabled = false }) => {
  const [messageSuccess, setMessageSuccess] = useState('')
  const [messageError, setMessageError] = useState('')
  const dispatch = useDispatch()

  // const uploadInvoice = async (documentFiles) => {
  //   let formData = new FormData();
  //   for (const file of documentFiles) {
  //     formData.append('file[]', file);
  //   }
  //   await fetch(endpoint,
  //     {
  //       method: 'POST',
  //       body: formData
  //     },
  //   );
  // };

  // const invoiceUploadHandler = ({ files }) => {
  //   //const [file] = files;
  //   const fileList = Array.from(files) as File[]; // Forçando o tipo File[]

  //   const fileReader = new FileReader();

  //   fileReader.onload = (e) => {
  //     uploadInvoice(fileList)
  //     // for (const file of files) {
  //     //   uploadInvoice([file]);
  //     // }
  //     //uploadInvoice(e.target.result);
  //   };
  //   //fileReader.readAsDataURL(file);
  //   fileList.forEach((file) => {
  //     fileReader.readAsDataURL(file);
  //   });
  // };



  const updateRequests = () => {
    dispatch({
      type: LAYOUT_MAKE_REQUEST,
      payload: {
        makeRequest: Math.random(),
      },
    })
  }

  const onTemplateUpload = () => {
    call && call()
    setMessageSuccess('Arquivo(s) importado com sucesso.');
    updateRequests()
    closeModal && closeModal()
    toast.success('Arquivo(s) importado com sucesso')
    otherCall && otherCall()
  }

  const onTemplateClear = (event: FileUploadErrorEvent) => {
    const response = JSON.parse(event.xhr.responseText)
    setMessageError(response?.message)
  };

  return (
    <div className="card">
      {messageSuccess && <Alert>{messageSuccess}</Alert>}
      {messageError && <Alert severity='error'>{messageError}</Alert>}
      <FileUpload
        //customUpload={true}
        //uploadHandler={invoiceUploadHandler}
        onUpload={onTemplateUpload}
        name={multiple ? 'file[]' : 'file'}
        url={endpoint}
        multiple={multiple}
        accept={accept}
        maxFileSize={100000000000}
        uploadLabel='Enviar'
        cancelLabel='Cancelar'
        chooseLabel='Procurar'
        onError={onTemplateClear}
        invalidFileSizeMessageSummary='Arquivo inválido.'
        invalidFileSizeMessageDetail='Tamanho máximo excedido.'
        disabled={disabled}
        emptyTemplate={<p className="m-0">Arraste e solte o arquivo para aqui para carregar.</p>} />
    </div>
  )
}
