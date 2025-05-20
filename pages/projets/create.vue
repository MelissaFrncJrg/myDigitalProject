<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Créer un nouveau projet</h1>

    <form class="space-y-4" @submit.prevent="submitProject">
      <UInput v-model="title" placeholder="Titre du projet" required />
      <UTextarea v-model="description" placeholder="Description" required />
      <USelect
        v-model="status"
        :items="items"
        placeholder="Statut"
      />

      <UButton :disabled="loading" type="submit" class="w-full">
        <template v-if="!loading">
          Créer le projet
        </template>
      </UButton>

      <div v-if="success" class="text-green-500">{{ success }}</div>
      <div v-if="error" class="text-red-500">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProjectService } from '@/services/projectService'
import { useRouter } from 'vue-router'

const router = useRouter()
const { createProject, loading, error, success } = useProjectService()
const { checkAccess } = useCreatorGuard()

onMounted(() => checkAccess())

const title = ref('')
const description = ref('')

const items = ref([
    {
        label: 'En cours',
        value: 'in_progress'
    },
    {
        label: 'Terminé',
        value: 'completed'
    },
    {
        label: 'En pause',
        value: 'on_hold'
    }
])
const status = ref('in_progress')

const submitProject = async () => {
  const project = await createProject({
    title: title.value,
    description: description.value,
    status: status.value
  })

  if (project) {
    router.push(`/projects/${project.id}`)
  }
}
</script>
