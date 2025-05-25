<template>
  <div class="p-8 max-w-5xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Mes Projets</h1>
      <UModal v-model="isCreateModalOpen" title="Création d'un projet">
        <UButton icon="i-heroicons-plus" @click="isCreateModalOpen = true"
          >Nouveau projet</UButton
        >

        <template #body>
          <FormPopup
            @submitted="handleCreated"
            @close="isCreateModalOpen = false"
          />
        </template>
      </UModal>
    </div>

    <div v-if="loading" class="text-center text-gray-400">Chargement...</div>
    <div v-else-if="projects.length === 0" class="text-center text-gray-400">
      Aucun projet pour l'instant
    </div>

    <div v-else class="grid md:grid-cols-2 gap-4">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-gray-800 p-4 rounded shadow text-white"
      >
        <h2 class="text-xl font-semibold">{{ project.title }}</h2>
        <p class="text-sm text-gray-400 mb-2">
          Statut : {{ formatStatus(project.status) }}
        </p>
        <p class="mb-4">{{ project.description }}</p>

        <div class="flex gap-2">
          <UModal v-model="isEditModalOpen" title="Modification d'un projet">
            <UButton
              size="sm"
              icon="i-heroicons-pencil"
              @click="editProject(project)"
              >Modifier</UButton
            >

            <template #body>
              <FormPopup
                :initial-data="projectToEdit"
                :submit-label="'Mettre à jour'"
                @submitted="handleUpdated"
                @close="isEditModalOpen = false"
              />
            </template>
          </UModal>

          <UModal v-model="isDeleteModalOpen" title="Supprimer ce projet ?">
            <UButton
              size="sm"
              color="error"
              icon="i-heroicons-trash"
              @click="confirmDelete(project)"
              >Supprimer</UButton
            >

            <template #body>
              <div class="space-y-4">
                <p class="text-gray-300">
                  Es-tu sûr de vouloir supprimer
                  <strong class="text-white">{{
                    projectToDelete?.title
                  }}</strong>
                  ? <br />Cette action est
                  <span class="text-red-500 font-semibold">irréversible</span>.
                </p>

                <UButton
                  label="Supprimer"
                  color="error"
                  :disabled="loading"
                  @click="deleteConfirmed"
                />
              </div>
            </template>
          </UModal>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProjectService } from "@/services/projectService";
import FormPopup from "~/components/projects/FormPopup.vue";

const { createProject, updateProject, getMyProjects, deleteProject, loading } =
  useProjectService();

const projects = ref([]);
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const projectToEdit = ref(null);
const projectToDelete = ref(null);

const fetchProjects = async () => {
  const res = await getMyProjects();
  if (res) projects.value = res;
};

onMounted(() => {
  fetchProjects();
});

const handleCreated = async (formData) => {
  await createProject(formData);
  isCreateModalOpen.value = false;
  await fetchProjects();
};

const handleUpdated = async (formData) => {
  if (!projectToEdit.value?.id) return;

  await updateProject(projectToEdit.value.id, formData);
  isEditModalOpen.value = false;
  await fetchProjects();
};

const editProject = (project) => {
  projectToEdit.value = { ...project };
  isEditModalOpen.value = true;
};

const confirmDelete = (project) => {
  projectToDelete.value = project;
  isDeleteModalOpen.value = true;
};

const deleteConfirmed = async () => {
  if (!projectToDelete.value?.id) return;

  await deleteProject(projectToDelete.value.id);
  isDeleteModalOpen.value = false;
  projectToDelete.value = null;
  await fetchProjects();
};

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
</script>
