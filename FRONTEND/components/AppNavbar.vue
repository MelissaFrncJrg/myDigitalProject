<template>
  <nav class="bg-gray-900 text-white p-4 flex justify-between items-center">
    <div class="text-2xl font-bold">
      <NuxtLink to="/">Nebula</NuxtLink>
    </div>

    <div class="flex items-center gap-4">
      <!-- Si l'utilisateur est connecté -->
      <div v-if="isAuthenticated">
        <span>Bienvenue, {{ user.username }}</span>
        <UButton size="sm" class="bg-red-600 hover:bg-red-700 text-white ml-4" @click="logout">
          Déconnexion
        </UButton>
      </div>

      <!-- Si l'utilisateur n'est pas connecté -->
      <div v-else>
        <NuxtLink to="/login" class="text-white hover:text-gray-400">Se connecter</NuxtLink>
        <NuxtLink to="/register" class="ml-4 text-white hover:text-gray-400">S'inscrire</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

// Accès aux données utilisateur
const user = computed(() => userStore.getUser)
const isAuthenticated = computed(() => userStore.isLoggedIn)

// Fonction de déconnexion
const logout = () => {
  userStore.clearUser()
  window.location.href = "/"
}
</script>