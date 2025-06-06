import { ref } from "vue";
import { useNuxtApp } from "#app";
import type { AxiosInstance } from "axios";
import { useUserStore } from "@/stores/userStore";

export const useProjectService = () => {
  const { $api } = useNuxtApp();
  const userStore = useUserStore();

  if (!$api) throw new Error("Axios instance not provided");
  const api = $api as AxiosInstance;

  const loading = ref(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);
  const currentProject = ref<any | null>(null);

  const createProject = async (projectData: {
    title: string;
    description: string;
    status?: string;
  }) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    try {
      const token = userStore.getToken;
      const response = await api.post("/projects", projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      success.value = response.data.message;
      return response.data.project;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erreur serveur";
    } finally {
      loading.value = false;
    }
  };

  const updateProject = async (
    projectId: number,
    updatedFields: {
      title?: string;
      description?: string;
      status?: string;
    }
  ) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    try {
      const token = userStore.getToken;
      const response = await api.patch(
        `/projects/${projectId}`,
        updatedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      success.value = response.data.message;
      return response.data.project;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || "Erreur lors de la mise à jour";
    } finally {
      loading.value = false;
    }
  };

  const deleteProject = async (projectId: number) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    try {
      const token = userStore.getToken;
      const response = await api.delete(`/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      success.value = response.data.message;
      return true;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || "Erreur lors de la suppression";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const getProjectById = async (projectId: number) => {
    loading.value = true;
    error.value = null;
    currentProject.value = null;

    try {
      const token = userStore.getToken;
      const response = await api.get(`/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { project, isFollowedByCurrentUser, notificationsEnabled } =
        response.data;

      project.isFollowedByCurrentUser = isFollowedByCurrentUser;
      project.notificationsEnabled = notificationsEnabled;

      currentProject.value = project;
      return { project, isFollowedByCurrentUser, notificationsEnabled };
    } catch (err: any) {
      error.value =
        err.response?.data?.message || "Erreur lors du chargement du projet";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const getMyProjects = async () => {
    loading.value = true;
    error.value = null;

    try {
      const token = userStore.getToken;
      const response = await api.get("/projects/mine", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.projects;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || "Erreur lors du chargement des projets";
      return [];
    } finally {
      loading.value = false;
    }
  };

  const getReviewsByProjectId = async (projectId: number) => {
    try {
      const response = await api.get(`/projects/${projectId}/reviews`);
      return response.data.reviews;
    } catch (err: any) {
      console.error("Erreur lors de la récupération des avis", err);
      return [];
    }
  };

  const createOrUpdateReview = async (
    projectId: number,
    data: { rating: number; comment: string }
  ) => {
    try {
      const token = userStore.getToken;
      const response = await api.post(`/projects/${projectId}/review`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.review;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Erreur lors de l’envoi de l’avis"
      );
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      const token = userStore.getToken;
      const response = await api.delete(`/projects/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.message;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Erreur lors de la suppression"
      );
    }
  };

  const likeReview = async (reviewId: number) => {
    try {
      const token = userStore.getToken;
      const res = await api.post(
        `/projects/reviews/${reviewId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Erreur lors du like");
    }
  };

  const unlikeReview = async (reviewId: number) => {
    try {
      const token = userStore.getToken;
      const res = await api.delete(`/projects/reviews/${reviewId}/like`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Erreur lors du unlike");
    }
  };

  const followProject = async (projectId: number) => {
    const token = userStore.getToken;
    await api.post(
      `/projects/${projectId}/follow`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  const unfollowProject = async (projectId: number) => {
    const token = userStore.getToken;
    await api.delete(`/projects/${projectId}/follow`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const updateProjectNotifications = async (
    projectId: number,
    enabled: boolean
  ) => {
    try {
      const token = userStore.getToken;
      const response = await api.patch(
        `/projects/${projectId}/notifications`,
        {
          notificationsEnabled: enabled,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.updated;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          "Erreur lors de la mise à jour des notifications"
      );
    }
  };

  return {
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    getMyProjects,
    currentProject,
    getReviewsByProjectId,
    createOrUpdateReview,
    deleteReview,
    likeReview,
    unlikeReview,
    followProject,
    unfollowProject,
    updateProjectNotifications,
    loading,
    error,
    success,
  };
};
