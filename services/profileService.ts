import { ref } from 'vue'
import { useNuxtApp } from '#app'
import type { AxiosInstance } from 'axios'
import { useUserStore } from '~/stores/userStore'

export const useProfileService = () => {
  const { $api } = useNuxtApp()
  const userStore = useUserStore()

  if (!$api) {
    throw new Error("Axios instance not provided")
  }

  const api = $api as AxiosInstance
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref<string | null>(null)

  // 🌟 On regroupe les informations dans un objet profil
  const profile = ref({
    username: '',
    avatarUrl: '',
    bio: '',
    socialLinks: {
      twitter: '',
      github: '',
      website: ''
    }
  })

  // 🔎 Méthode pour récupérer le profil depuis l'API
  const fetchProfile = async () => {
    loading.value = true
    error.value = null

    try {
      const token = userStore.getToken
      if (!token) {
        error.value = "Token d'authentification manquant."
        return
      }

      const response = await api.get('/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      // 🌟 Mise à jour du profil
      profile.value = {
        username: response.data.profile.username,
        avatarUrl: response.data.profile.avatarUrl,
        bio: response.data.profile.bio,
        socialLinks: response.data.profile.socialLinks || {
          twitter: '',
          github: '',
          website: ''
        }
      }
    } catch (err: any) {
      if (err.response) {
        error.value = err.response.data.message
      } else {
        error.value = 'Erreur serveur. Veuillez réessayer plus tard.'
      }
    } finally {
      loading.value = false
    }
  }

  // 🔄 Méthode pour mettre à jour le profil
  const updateProfile = async (profileData: any) => {
    loading.value = true
    error.value = null
    success.value = null

    try {
      const token = userStore.getToken
      const response = await api.patch('/profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (response.data.success) {
        success.value = response.data.message
        userStore.setUser(response.data.data) // Mise à jour du store
      }
    } catch (err: any) {
      if (err.response) {
        error.value = err.response.data.message
      } else {
        error.value = 'Erreur serveur. Veuillez réessayer plus tard.'
      }
    } finally {
      loading.value = false
    }
  }

  return {
    fetchProfile,
    updateProfile,
    loading,
    error,
    success,
    profile
  }
}
