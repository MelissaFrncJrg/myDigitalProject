<template>
  <nav class="bg-gray-900 text-white p-4 flex justify-between items-center">
    <div class="text-2xl font-bold">
      <NuxtLink to="/">Nebula</NuxtLink>
    </div>

    <div class="flex items-center gap-4">
      <!-- Si l'utilisateur est connecté -->
      <div v-if="isAuthenticated">
        <span class="transition-opacity duration-300">
          Bienvenue {{ profile?.username || '...' }}
        </span>
        <NuxtLink to="/profile" class="text-white hover:text-gray-400 ml-4">
          Mon Profil
        </NuxtLink>
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
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { navigateTo } from 'nuxt/app'

const userStore = useUserStore()
const isAuthenticated = computed(() => userStore.isLoggedIn)
const profile = computed(() => userStore.getProfile)

// 🌟 Événement global pour détecter les mises à jour du profil
onMounted(() => {
  document.addEventListener('user:updated', () => {
    console.log("🚀 Profil mis à jour depuis un autre composant.")
  })
})

const logout = () => {
  userStore.clearUser()
  navigateTo('/login')
}
</script>
