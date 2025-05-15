<template>
  <div class="p-8 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">Créer un compte</h1>

    <form class="space-y-4" @submit.prevent="handleRegister">
      <UInput v-model="email" placeholder="Email" required />
      <UInput v-model="username" placeholder="Nom d'utilisateur" required />
      <UInput v-model="password" placeholder="Mot de passe" type="password" required />
      <UButton :disabled="loading" type="submit" class="w-full">
        {{ loading ? 'Création en cours...' : 'Créer un compte' }}
      </UButton>
    </form>

    <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>

    <div v-if="message" class="text-green-500 mt-4">{{ message }}</div>

    <div v-if="qrCodeUrl" class="mt-6">
      <h2 class="text-lg font-semibold">QR Code pour 2FA :</h2>
      <img :src="qrCodeUrl" alt="QR Code" class="mt-2">
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthService } from '@/services/authService'

const email = ref('')
const username = ref('')
const password = ref('')

const { register, loading, error, qrCodeUrl, message } = useAuthService()

const handleRegister = () => {
  register(email.value, password.value, username.value)
}
</script>
