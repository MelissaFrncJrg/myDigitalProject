import { ref } from 'vue'

const API_URL = '/auth'

export const useAuthService = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const qrCodeUrl = ref<string | null>(null)
  const userId = ref<number | null>(null)
  const message = ref<string | null>(null)

  const register = async (email: string, password: string, username: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        error.value = errorData.message || 'Erreur lors de la création du compte.'
        loading.value = false
        return
      }

      const data = await response.json()
      message.value = data.message
      qrCodeUrl.value = data.qrCodeUrl
      userId.value = data.userId
    } catch (err: any) {
      error.value = 'Erreur serveur. Veuillez réessayer plus tard.'
    } finally {
      loading.value = false
    }
  }

  return {
    register,
    loading,
    error,
    qrCodeUrl,
    userId,
    message,
  }
}
