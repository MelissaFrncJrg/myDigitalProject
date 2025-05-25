import axios from "axios";
import { useUserStore } from "~/stores/userStore";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use((reqConfig) => {
    const userStore = useUserStore();

    const token = userStore.getToken;
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }

    return reqConfig;
  });

  nuxtApp.provide("api", api);
});
