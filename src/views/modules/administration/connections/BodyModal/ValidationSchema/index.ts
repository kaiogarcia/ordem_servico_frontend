import * as Yup from 'yup';

const ValidationFormSchema = {
    connectionName: 
      Yup.string()
        .max(255, 'Precisa ter no máximo 255 caracteres.')
        .required('Nome da conexão obrigatório!')
};

export const ValidationForm = Yup.object(ValidationFormSchema);
