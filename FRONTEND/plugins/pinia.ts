import { defineNuxtPlugin } from '#app'
import { createPinia } from 'pinia'
import { useUserStore } from '~/stores/userStore'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia()
  nuxtApp.vueApp.use(pinia)

  const userStore = useUserStore()
  userStore.loadUserFromStorage() // 🔄 Charge l'utilisateur si présent dans localStorage
})
