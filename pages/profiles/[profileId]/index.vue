<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">Projets du créateur</h1>

    <div v-if="loading" class="text-gray-400">Chargement...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else-if="projects.length === 0" class="text-gray-400">
      Ce créateur n’a pas encore publié de projets.
    </div>

    <div v-else class="space-y-6">
      <div v-for="project in projects" :key="project.id" class="bg-gray-800 p-4 rounded shadow text-white">
        <h2 class="text-xl font-semibold">{{ project.title }}</h2>
        <p class="text-sm text-gray-400 mb-2">Statut : {{ formatStatus(project.status) }}</p>
        <p>{{ project.description }}</p>

        <NuxtLink :to="`/projects/${project.id}`" class="text-blue-400 hover:underline text-sm mt-2 inline-block">
            <UButton>
                Voir le projet
            </UButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useNuxtApp } from '#app'

const route = useRoute()
const profileId = route.params.profileId

const { $api } = useNuxtApp()
const loading = ref(false)
const error = ref('')
const projects = ref([])

const formatStatus = (status) => {
  switch (status) {
    case 'in_progress': return 'En cours'
    case 'published': return 'Publié'
    case 'canceled': return 'Annulé'
    default: return status
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await $api.get(`/projects/creators/${profileId}`)
    projects.value = res.data.projects
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur serveur'
  } finally {
    loading.value = false
  }
})
</script>
