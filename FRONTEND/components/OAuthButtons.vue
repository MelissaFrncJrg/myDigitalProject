<template>
  <div class="flex flex-col gap-4">
    <UButton class="bg-red-500 hover:bg-red-600 text-white" @click="redirectTo('/auth/google')">
      <i class="fab fa-google mr-2"/> Se connecter avec Google
    </UButton>
    <UButton class="bg-gray-800 hover:bg-gray-900 text-white" @click="redirectTo('/auth/github')">
      <i class="fab fa-github mr-2"/> Se connecter avec GitHub
    </UButton>
    <UButton class="bg-indigo-600 hover:bg-indigo-700 text-white" @click="redirectTo('/auth/discord')">
      <i class="fab fa-discord mr-2"/> Se connecter avec Discord
    </UButton>
    <UButton class="bg-green-600 hover:bg-green-700 text-white" @click="redirectTo('/auth/steam')">
      <i class="fab fa-steam mr-2"/> Se connecter avec Steam
    </UButton>
  </div>
</template>

<script setup>
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()
const redirectTo = (provider) => {
  const backendUrl = config.public.apiBase
  window.location.href = `${backendUrl}/auth/${provider}`
}
</script>

<style scoped>
/* Si tu veux ajouter des icônes FontAwesome, pense à les importer */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
</style>
