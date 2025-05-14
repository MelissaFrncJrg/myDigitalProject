import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const api = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Injection globale
  nuxtApp.provide('api', api)
})
