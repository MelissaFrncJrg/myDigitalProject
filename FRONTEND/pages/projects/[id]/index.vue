<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <div v-if="project" class="space-y-6">
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

    <div v-if="reviews.length" class="mt-10 space-y-4">
      <h2 class="text-xl font-semibold text-white">Avis des utilisateurs</h2>
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

    <div v-if="userStore.isLoggedIn && project" class="mt-10">
      <h2 class="text-lg font-semibold text-white mb-2">Laisser un avis</h2>

      <UForm :schema="reviewSchema" :state="reviewForm" class="space-y-4" @submit="onSubmit">
        <UFormField label="Note (1 à 5)" name="rating">
          <UInput v-model="reviewForm.rating" type="number" min="1" max="5" />
        </UFormField>

        <UFormField label="Commentaire" name="comment">
          <UTextarea v-model="reviewForm.comment" placeholder="Partage ton avis..." />
        </UFormField>

        <UButton type="submit" color="primary">Envoyer</UButton>

        <div v-if="reviewSuccess" class="text-green-500 mt-2">{{ reviewSuccess }}</div>
        <div v-if="reviewError" class="text-red-500 mt-2">{{ reviewError }}</div>
      </UForm>
    </div>

    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <div v-else class="text-gray-400">Chargement du projet...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useProjectService } from '@/services/projectService'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const projectId = Number(route.params.id)

const { getProjectById, getReviewsByProjectId, createOrUpdateReview, loading, error } = useProjectService()
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
const reviewError = ref('')
const reviewSuccess = ref('')
const isFollowing = ref(false)

const canFollow = computed(() => {
  return userStore.isLoggedIn && userStore.getUser?.id !== project.value?.creatorId
})

// 💡 Validation Schema (Valibot)
const reviewSchema = v.object({
  rating: v.pipe(v.number(), v.minValue(1, 'Min 1'), v.maxValue(5, 'Max 5')),
  comment: v.pipe(v.string(), v.minLength(3, 'Le commentaire est trop court'))
})

type ReviewForm = v.InferOutput<typeof reviewSchema>

const reviewForm = reactive<ReviewForm>({
  rating: 5,
  comment: ''
})

const onSubmit = async (event: FormSubmitEvent<ReviewForm>) => {
  reviewError.value = ''
  reviewSuccess.value = ''

  try {
    await createOrUpdateReview(projectId, event.data)
    reviewSuccess.value = "Merci pour votre avis !"
    await fetchReviews()
  } catch (err: any) {
    reviewError.value = err.message
  }
}

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
    case 'completed': return 'Terminé'
    case 'on_hold': return 'En pause'
    default: return 'Inconnu'
  }
}

const toggleFollow = async () => {
  isFollowing.value = !isFollowing.value
}
</script>
