<template>
  <nav class="bg-gray-900 text-white p-4 flex justify-between items-center">
    <div class="text-2xl font-bold">
      <NuxtLink to="/">Nebula</NuxtLink>
    </div>

    <div class="flex items-center gap-4">
      <!-- Si l'utilisateur est connecté -->
      <div v-if="isAuthenticated">
        <span>Bienvenue {{ profile?.username }}</span>
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
import { useProfileService } from '@/services/profileService'

const userStore = useUserStore()
const { fetchProfile, profile } = useProfileService()

const isAuthenticated = computed(() => userStore.isLoggedIn)

onMounted(async () => {
  if (isAuthenticated.value) {
    await fetchProfile()
  }
})

const logout = () => {
  userStore.clearUser()
  window.location.href = "/"
}
</script>
