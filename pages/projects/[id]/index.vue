<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <div v-if="project" class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold">{{ project.title }}</h1>
        <UBadge :label="statusLabel(project.status)" color="blue" />
      </div>

      <p class="text-gray-300">{{ project.description }}</p>

      <div class="text-sm text-gray-400">
        Créé le : {{ formatDate(project.createdAt) }}
      </div>

      <div v-if="project.creatorName" class="text-sm text-gray-400">
        Créateur : {{ project.creatorName }}
      </div>

      <!-- Bouton de suivi -->
      <UButton
        v-if="canFollow"
        :label="isFollowing ? 'Ne plus suivre' : 'Suivre ce projet'"
        color="primary"
        variant="solid"
        :disabled="loading"
        @click="toggleFollow"
      />
    </div>

    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <div v-else class="text-gray-400">Chargement du projet...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectService } from '@/services/projectService'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const projectId = Number(route.params.id)

const { getProjectById, loading, error } = useProjectService()
const userStore = useUserStore()

const project = ref(null)
const isFollowing = ref(false) // TODO: gestion du follow
const canFollow = computed(() => {
  return userStore.isLoggedIn &&
    userStore.getUser?.id !== project.value?.creatorId
})

onMounted(async () => {
  const fetched = await getProjectById(projectId)
  if (fetched) {
    project.value = fetched
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const statusLabel = (status) => {
  switch (status) {
    case 'in_progress': return 'En cours'
    case 'completed': return 'Terminé'
    case 'on_hold': return 'En pause'
    default: return 'Inconnu'
  }
}

const toggleFollow = async () => {
  // TODO: call follow/unfollow service
  isFollowing.value = !isFollowing.value
}
</script>
