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

      userStore.setProfile(profile.value)
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
        userStore.setUser(response.data.data)
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

  // 🌟 Méthode pour switcher vers le rôle Creator
  const switchToCreator = async () => {
    loading.value = true
    error.value = null
    success.value = null

    try {
      const response = await api.patch('/profile/switch-to-creator')

      if (response.data.success) {
        success.value = response.data.message
        userStore.setUser({
          ...userStore.getUser,
          role: 'CREATOR'
        })
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

  // 🌟 Suppression de compte
  const deleteAccount = async (password: string, totpToken?: string) => {
    loading.value = true
    error.value = null
    success.value = null

    try {
      const token = userStore.getToken
      if (!token) {
        error.value = "Token d'authentification manquant."
        return
      }

      const response = await api.delete('/profile/delete-account', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          password,
          totpToken
        }
      })
      
      if (response.status === 200) {
        success.value = response.data.message
        userStore.clearUser()
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
    switchToCreator,
    deleteAccount,
    loading,
    error,
    success,
    profile
  }
}
