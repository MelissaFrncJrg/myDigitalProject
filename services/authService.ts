import { ref } from "vue";
import { useNuxtApp } from "#app";
import { useUserStore } from "~/stores/userStore";
import { useProfileService } from "@/services/profileService";
import type { AxiosInstance } from "axios";

export const useAuthService = () => {
  const { $api } = useNuxtApp();
  if (!$api) {
    throw new Error("Axios instance not provided");
  }

  const api = $api as AxiosInstance;

  const loading = ref(false);
  const error = ref<string | null>(null);

  const qrCodeUrl = ref<string | null>(null);
  const userId = ref<number | null>(null);
  const message = ref<string | null>(null);

  const user = ref<any | null>(null);
  const isTotpEnabled = ref(false);
  const userStore = useUserStore();
  const { fetchProfile } = useProfileService(); // 🔄 On importe le fetchProfile

  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        username,
      });

      message.value = response.data.message;
      qrCodeUrl.value = response.data.qrCodeUrl;
      userId.value = response.data.userId;
    } catch (err: any) {
      if (err.response) {
        error.value =
          err.response.data.message || "Erreur lors de la création du compte.";
      } else {
        error.value = "Erreur serveur. Veuillez réessayer plus tard.";
      }
    } finally {
      loading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.isTotpEnabled) {
        isTotpEnabled.value = true;
      } else {
        const userWithToken = {
          ...response.data.user,
          token: response.data.token,
        };
        userStore.setUser(userWithToken);
        console.log("✅ Login réussi :", user.value);
        await fetchProfile();
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        error.value = "Email ou mot de passe incorrect.";
      } else {
        error.value = "Erreur serveur. Veuillez réessayer plus tard.";
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    register,
    login,
    loading,
    error,
    qrCodeUrl,
    userId,
    message,
    user,
    isTotpEnabled,
  };
};
