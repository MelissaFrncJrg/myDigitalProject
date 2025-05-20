// services/projectService.ts
import { ref } from 'vue'
import { useNuxtApp } from '#app'
import type { AxiosInstance } from 'axios'
import { useUserStore } from '@/stores/userStore'

export const useProjectService = () => {
  const { $api } = useNuxtApp()
  const userStore = useUserStore()

  if (!$api) throw new Error("Axios instance not provided")
  const api = $api as AxiosInstance

  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref<string | null>(null)

  const createProject = async (projectData: {
    title: string
    description: string
    status?: string
  }) => {
    loading.value = true
    error.value = null
    success.value = null

    try {
      const token = userStore.getToken
      const response = await api.post('/projects', projectData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      success.value = response.data.message
      return response.data.project
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur serveur'
    } finally {
      loading.value = false
    }
  }

  return {
    createProject,
    loading,
    error,
    success
  }
}
