<template>
  <div class="p-8 max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

    <div class="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold mb-4">Informations du profil</h2>
      <p><strong>Nom d'utilisateur :</strong> {{ profile?.username }}</p>
      <p><strong>Email :</strong> {{ email }}</p>
      <p><strong>ID :</strong> {{ id }}</p>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'

// On active le middleware sur cette page
definePageMeta({
  middleware: 'auth'
})

const userStore = useUserStore()
const user = userStore.getUser
const profile = computed(() => userStore.getUser?.profile)
const email = computed(() => user?.email)
const id = computed(() => user?.id)
</script>
