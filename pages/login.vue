<template>
  <div class="p-8 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">Se connecter</h1>

    <form class="space-y-4" @submit.prevent="handleLogin">
      <UInput v-model="email" placeholder="Email" required />
      <UInput v-model="password" placeholder="Mot de passe" type="password" required />
      <UButton :disabled="loading" type="submit" class="w-full">
        {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
      </UButton>
    </form>

    <div class="divider my-6">OU</div>

    <OAuthButtons />

    <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>

    <div v-if="isTotpEnabled" class="text-yellow-500 mt-4">
      L'authentification 2FA est requise. Veuillez entrer le code TOTP.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthService } from '@/services/authService'
import { useRouter } from 'vue-router'
import OAuthButtons from '~/components/OAuthButtons.vue'

const email = ref('')
const password = ref('')
const router = useRouter()
const { login, loading, error, isTotpEnabled } = useAuthService()

const handleLogin = async () => {
  await login(email.value, password.value)

  if (!error.value && !isTotpEnabled.value) {
    console.log("🚀 Redirection vers la page d'accueil")
    router.push('/')
  }
}
</script>
