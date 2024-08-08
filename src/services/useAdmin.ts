import axios from 'axios'
import { useEffect, useState } from 'react'
import { getFirstName } from 'src/helpers/firstName'
import { useAuth } from 'src/hooks/useAuth'

export const useAdmin = () => {
  const { setUserData, user } = useAuth()

  const apiAdmin = axios.create({
    baseURL: user?.user?.ip
      ? `http://${user?.user?.ip}:${process.env.REACT_APP_PORT_BACKEND}/`
      : process.env.REACT_APP_ADMIN_API_HOST,
  })

  //const user = JSON.parse(localStorage.getItem('@WhatsManagerStorage'));

  apiAdmin.defaults.headers['Authorization'] = `Bearer ${user?.token}`
  apiAdmin.defaults.headers['Content-Type'] = `application/json`
  apiAdmin.defaults.headers['sessionkey'] = user?.user?.cpf
  apiAdmin.defaults.headers['user'] = getFirstName(user?.user?.name)

  apiAdmin.interceptors.request.use(
    (config) => {
      //const userData = JSON.parse(localStorage.getItem('@WhatsManagerStorage'));
      const { headers = {} } = config

      if (user?.token) {
        headers.Authorization = `Bearer ${user?.token}`
        headers['sessionkey'] = user?.user?.cpf
      }
      // if (userData) {}

      return config
    },
    (error) => Promise.reject(error),
  )

  apiAdmin.interceptors.response.use(
    (response) => {
      return response
    },
    async function (error) {
      const originalReq = error.config
      if (
        error?.response?.status !== 500 &&
        error.config &&
        !error.config._retry
      ) {
        originalReq._retry = true
        //const userData = JSON.parse(localStorage.getItem('@WhatsManagerStorage'));
        let res = apiAdmin
          .put(`token/refresh`, { oldToken: user?.token })
          .then((response) => {
            // window.localStorage.setItem('@WhatsManagerStorage', JSON.stringify({ ...user, token: response.data.access_token }));
            setUserData(user?.user, response.data.access_token)
            originalReq.headers[
              'Authorization'
            ] = `Bearer ${response?.data?.access_token}`
            originalReq.headers['Content-Type'] = `application/json`
            originalReq.headers['sessionkey'] = user?.user?.cpf
            return axios(originalReq)
          })
        return res
      } else {
        return error
      }
    },
  )

  return { apiAdmin }
}
