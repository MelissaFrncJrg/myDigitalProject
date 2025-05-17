import { ref } from 'vue'
import { useNuxtApp } from '#app'
import { useUserStore } from '~/stores/userStore'
import type { AxiosInstance } from 'axios'

export const useAuthService = () => {
  // On injecte l'instance Axios avec un typage explicite
  const { $api } = useNuxtApp()
  if (!$api) {
    throw new Error("Axios instance not provided")
  }

  // On force le typage (sinon TypeScript ne sait pas ce que c'est)
  const api = $api as AxiosInstance

  // 🌟 État partagé entre login et register
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 🌟 État spécifique à l'inscription 
  const qrCodeUrl = ref<string | null>(null)
  const userId = ref<number | null>(null)
  const message = ref<string | null>(null)

  // 🌟 État spécifique à la connexion
  const user = ref<any | null>(null)
  const isTotpEnabled = ref(false)
  const userStore = useUserStore()

  const register = async (email: string, password: string, username: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        username,
      })

      message.value = response.data.message
      qrCodeUrl.value = response.data.qrCodeUrl
      userId.value = response.data.userId
    } catch (err: any) {
      if (err.response) {
        error.value = err.response.data.message || 'Erreur lors de la création du compte.'
      } else {
        error.value = 'Erreur serveur. Veuillez réessayer plus tard.'
      }
    } finally {
      loading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      if (response.data.isTotpEnabled) {
        isTotpEnabled.value = true
      } else {
        user.value = response.data.user
        userStore.setUser(response.data.user)
        console.log('✅ Login réussi :', user.value)
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        error.value = 'Email ou mot de passe incorrect.'
      } else {
        error.value = 'Erreur serveur. Veuillez réessayer plus tard.'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    register,
    login,
    loading,
    error,
    qrCodeUrl,
    userId,
    message,
    user,
    isTotpEnabled
  }
}
