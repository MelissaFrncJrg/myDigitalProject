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

      <div class="flex items-center gap-2">
        <UButton
          v-if="canFollow"
          :label="isFollowing ? 'Ne plus suivre' : 'Suivre ce projet'"
          :icon="isFollowing ? 'heroicons:heart-solid' : 'heroicons:heart'"
          color="primary"
          variant="solid"
          :disabled="loading"
          @click="toggleFollow"
        />
        <UButton
          v-if="isFollowing"
          :label="
            notificationsEnabled
              ? 'Désactiver les notifications'
              : 'Activer les notifications'
          "
          :icon="
            notificationsEnabled ? 'heroicons:bell-solid' : 'heroicons:bell'
          "
          color="primary"
          variant="outline"
          :disabled="loading"
          @click="toggleNotifications"
        />
      </div>
    </div>

    <div class="mt-10 space-y-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-1">
          <h2 class="text-xl font-semibold text-white">
            Avis des utilisateurs
          </h2>
          <UBadge :label="`${reviews.length}`" variant="soft" class="ml-2" />
        </div>

        <UModal
          v-if="userStore.isLoggedIn && project"
          v-model="isReviewModalOpen"
          :title="myReview ? 'Modifier mon avis' : 'Laisser un avis'"
        >
          <UButton
            size="sm"
            :icon="myReview ? 'i-heroicons-pencil' : 'i-heroicons-plus'"
            @click="isReviewModalOpen = true"
          >
            {{ myReview ? "Modifier mon avis" : "Ajouter un avis" }}
          </UButton>

          <template #body>
            <FormPopup
              :project-id="projectId"
              :initial-data="myReview"
              @submitted="handleReviewSubmitted"
              @close="isReviewModalOpen = false"
            />
          </template>
        </UModal>
      </div>

      <div v-if="reviews.length === 0" class="text-gray-400 text-sm">
        Aucun avis n’a encore été laissé pour ce projet.
      </div>

      <div
        v-for="review in reviews"
        :key="review.ID_review"
        class="border border-gray-700 p-4 rounded text-white"
      >
        <div class="flex justify-between items-center mb-1">
          <span class="font-semibold">{{
            review.author?.profile?.username || "Utilisateur anonyme"
          }}</span>

          <div class="flex items-center gap-2">
            <UBadge :label="`Note : ${review.rating}/5`" color="primary" />
            <UButton
              v-if="review.author?.id === userStore.getUser?.id"
              icon="i-heroicons-trash"
              color="error"
              variant="ghost"
              @click="confirmDeleteReview(review.ID_review)"
            />
          </div>
        </div>

        <p class="text-sm text-gray-300">{{ review.comment }}</p>
        <div
          v-if="canLike"
          class="flex items-center gap-2 text-xs text-gray-400 mt-2"
        >
          <UButton
            variant="subtle"
            size="sm"
            icon="i-heroicons-hand-thumb-up"
            :color="
              review.likes?.some((l) => l.ID_user === userStore.getUser?.id)
                ? 'primary'
                : 'secondary'
            "
            @click="toggleLike(review)"
          >
            {{ review.likes?.length || 0 }} j’aime
          </UButton>
        </div>
      </div>
    </div>

    <div v-if="error" class="text-red-500">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useProjectService } from "@/services/projectService";
import { useUserStore } from "@/stores/userStore";
import FormPopup from "~/components/reviews/FormPopup.vue";
import type { Review } from "~/types/review";

const route = useRoute();
const projectId = Number(route.params.id);

const {
  getProjectById,
  getReviewsByProjectId,
  deleteReview,
  likeReview,
  unlikeReview,
  followProject,
  unfollowProject,
  updateProjectNotifications,
  loading,
  error,
} = useProjectService();
const userStore = useUserStore();

const project = ref<any>(null);
const reviews = ref<Review[]>([]);
const isFollowing = ref(false);
const notificationsEnabled = ref(false);
const isReviewModalOpen = ref(false);

const handleReviewSubmitted = async () => {
  isReviewModalOpen.value = false;
  await fetchReviews();
};

const myReview = computed(() => {
  return reviews.value.find((r) => r.author?.id === userStore.getUser?.id);
});

const canFollow = computed(() => {
  return (
    userStore.isLoggedIn && userStore.getUser?.id !== project.value?.creatorId
  );
});

const canLike = computed(() => {
  return (
    userStore.isLoggedIn && userStore.getUser?.id !== project.value?.creatorId
  );
});

const fetchReviews = async () => {
  const data = await getReviewsByProjectId(projectId);
  reviews.value = data;
  return data;
};

onMounted(async () => {
  const result = await getProjectById(projectId);
  if (result) {
    project.value = result.project;
    isFollowing.value = result.isFollowedByCurrentUser;
    notificationsEnabled.value = result.notificationsEnabled;
    await fetchReviews();
  }
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const statusLabel = (status: string) => {
  switch (status) {
    case "in_progress":
      return "En cours";
    case "published":
      return "Publié";
    case "canceled":
      return "Annulé";
    default:
      return "Inconnu";
  }
};

const confirmDeleteReview = async (reviewId: number) => {
  if (confirm("Voulez-vous vraiment supprimer votre avis ?")) {
    try {
      await deleteReview(reviewId);
      await fetchReviews();
    } catch (err: any) {
      console.error("Erreur lors de la suppression :", err.message);
    }
  }
};

const toggleLike = async (review: Review) => {
  if (!userStore.isLoggedIn) return;
  const alreadyLiked = review.likes?.some(
    (l) => l.ID_user === userStore.getUser?.id
  );

  try {
    if (alreadyLiked) {
      await unlikeReview(review.ID_review);
      review.likes =
        review.likes?.filter((l) => l.ID_user !== userStore.getUser?.id) || [];
    } else {
      await likeReview(review.ID_review);
      review.likes = [
        ...(review.likes || []),
        { ID_user: userStore.getUser?.id },
      ];
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

const toggleFollow = async () => {
  try {
    if (isFollowing.value) {
      await unfollowProject(projectId);
    } else {
      await followProject(projectId);
    }
    isFollowing.value = !isFollowing.value;
  } catch (err: any) {
    console.error(err.message);
  }
};

const toggleNotifications = async () => {
  try {
    const updated = await updateProjectNotifications(
      projectId,
      !notificationsEnabled.value
    );
    notificationsEnabled.value = updated.notificationsEnabled;
  } catch (err: any) {
    console.error("Erreur notifications :", err.message);
  }
};
</script>
