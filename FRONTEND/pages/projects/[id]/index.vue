<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <div v-if="project" class="border border-gray-700 p-4 rounded space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold">{{ project.title }}</h1>
        <UBadge :label="statusLabel(project.status)" color="secondary" />
      </div>

      <p class="text-gray-300">{{ project.description }}</p>

      <div class="text-sm text-gray-400">
        Créé le : {{ formatDate(project.createdAt) }}
      </div>

      <div v-if="project.creatorName" class="text-sm text-gray-400">
        Créateur : {{ project.creatorName }}
      </div>

      <UButton
        v-if="canFollow"
        :label="isFollowing ? 'Ne plus suivre' : 'Suivre ce projet'"
        color="primary"
        variant="solid"
        :disabled="loading"
        @click="toggleFollow"
      />
    </div>

    <div class="mt-10 space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-white">
          Avis des utilisateurs
          <span class="text-sm text-gray-400 font-normal">({{ reviews.length }})</span>
        </h2>

        <UModal v-if="userStore.isLoggedIn && project" v-model="isReviewModalOpen" title="Laisser un avis">
          <UButton size="sm" icon="i-lucide-plus" @click="isReviewModalOpen = true">
            Ajouter un avis
          </UButton>

          <template #body>
            <FormPopup :project-id="projectId" @submitted="handleReviewSubmitted" />
          </template>
        </UModal>
      </div>

      <div v-if="reviews.length === 0" class="text-gray-400 text-sm">
        Aucun commentaire n’a encore été laissé pour ce projet.
      </div>

      <div
        v-for="review in reviews"
        :key="review.ID_review"
        class="border border-gray-700 p-4 rounded text-white"
      >
        <div class="flex justify-between items-center mb-1">
          <span class="font-semibold">{{ review.author?.profile?.username || 'Utilisateur anonyme' }}</span>
          <UBadge :label="`Note : ${review.rating}/5`" color="primary" />
        </div>
        <p class="text-sm text-gray-300">{{ review.comment }}</p>
        <div class="text-xs text-gray-500 mt-2">👍 {{ review.likes?.length || 0 }} j’aime</div>
      </div>
    </div>

    <div v-if="error" class="text-red-500">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectService } from '@/services/projectService'
import { useUserStore } from '@/stores/userStore'
import FormPopup from '~/components/reviews/FormPopup.vue'

const route = useRoute()
const projectId = Number(route.params.id)

const { getProjectById, getReviewsByProjectId, loading, error } = useProjectService()
const userStore = useUserStore()

interface Review {
  ID_review: number
  rating: number
  comment?: string
  likes?: any[]
  author?: {
    profile?: {
      username?: string
    }
  }
}

const project = ref<any>(null)
const reviews = ref<Review[]>([])
const isFollowing = ref(false)
const isReviewModalOpen = ref(false)

const handleReviewSubmitted = async () => {
  isReviewModalOpen.value = false
  await fetchReviews()
}

const canFollow = computed(() => {
  return userStore.isLoggedIn && userStore.getUser?.id !== project.value?.creatorId
})

const fetchReviews = async () => {
  const data = await getReviewsByProjectId(projectId)
  reviews.value = data
  return data
}

onMounted(async () => {
  const fetched = await getProjectById(projectId)
  if (fetched) {
    project.value = fetched
    await fetchReviews()
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const statusLabel = (status: string) => {
  switch (status) {
    case 'in_progress': return 'En cours'
    case 'published': return 'Publié'
    case 'canceled': return 'Annulé'
    default: return 'Inconnu'
  }
}

const toggleFollow = async () => {
  isFollowing.value = !isFollowing.value
}
</script>
