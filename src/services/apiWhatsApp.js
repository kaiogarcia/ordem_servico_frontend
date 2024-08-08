import axios from 'axios';

const apiWhatsApp = axios.create({
    baseURL: process.env.REACT_APP_WHATSAPP_API_HOST
});

const userDattaAccount = JSON.parse(window.localStorage.getItem('datta-account'))
const { user } = userDattaAccount
const cpf = JSON.parse(user).cpf

apiWhatsApp.defaults.headers['apitoken'] = process.env.REACT_APP_TOKEN_WHATSAPP;
apiWhatsApp.defaults.headers['Content-Type'] = `application/json`;
apiWhatsApp.defaults.headers['sessionkey'] = cpf;

export default apiWhatsApp;
