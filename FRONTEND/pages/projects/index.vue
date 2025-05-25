<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Projets des créateurs</h1>

    <div v-if="loading" class="text-gray-400">Chargement...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else-if="projects.length === 0" class="text-gray-400">
      Aucun projet trouvé.
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-gray-800 text-white rounded-lg p-4 shadow"
      >
        <div class="flex items-center gap-3 mb-2">
          <UAvatar
            :src="
              project.creatorProfile?.avatarUrl ||
              'https://github.com/benjamincanac.png'
            "
          />
          <NuxtLink
            class="text-blue-400 hover:underline"
            :to="`/profiles/${project.creatorProfile?.id}`"
          >
            {{ project.creatorProfile?.username }}
          </NuxtLink>
        </div>

        <h2 class="text-xl font-semibold mb-1">{{ project.title }}</h2>
        <p class="text-sm text-gray-400 mb-2">
          {{ formatStatus(project.status) }}
        </p>
        <p>{{ project.description }}</p>

        <NuxtLink :to="`/projects/${project.id}`" class="inline-block mt-3">
          <UButton label="Voir le projet" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";

const { $api } = useNuxtApp();
const projects = ref([]);
const loading = ref(true);
const error = ref("");

const formatStatus = (status) => {
  switch (status) {
    case "in_progress":
      return "En cours";
    case "published":
      return "Publié";
    case "canceled":
      return "Annulé";
    default:
      return status;
  }
};

onMounted(async () => {
  try {
    const res = await $api.get("/projects/creators");
    projects.value = res.data.projects;
  } catch (err) {
    error.value = err.response?.data?.message || "Erreur serveur";
  } finally {
    loading.value = false;
  }
});
</script>
