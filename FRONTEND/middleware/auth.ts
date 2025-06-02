import { useUserStore } from "@/stores/userStore";

export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore();

  if (!userStore.isLoggedIn) {
    console.log("🔒 Accès refusé : redirection vers la page de connexion");
    return navigateTo("/login");
  }
});
