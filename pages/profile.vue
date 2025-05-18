<template>
  <div class="p-8 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Mon Profil</h1>

    <form class="space-y-4" @submit.prevent="handleUpdate">
      <UInput v-model="username" placeholder="Nom d'utilisateur" required />
      <UInput v-model="avatarUrl" placeholder="URL de l'avatar" />
      <UTextarea v-model="bio" placeholder="Votre bio" />

      <h2 class="text-lg font-semibold mt-4">Liens sociaux :</h2>
      <UInput v-model="socialLinks.twitter" placeholder="Twitter" />
      <UInput v-model="socialLinks.github" placeholder="GitHub" />
      <UInput v-model="socialLinks.website" placeholder="Site Web" />

      <UButton :disabled="loading" type="submit" class="w-full">
        {{ loading ? 'Mise à jour...' : 'Enregistrer les modifications' }}
      </UButton>
    </form>

    <div v-if="success" class="text-green-500 mt-4">{{ success }}</div>
    <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useProfileService } from '@/services/profileService'

const {
  fetchProfile,
  updateProfile,
  loading,
  error,
  success,
  profile
} = useProfileService()

// 🔄 Champs de formulaire
const username = ref('')
const avatarUrl = ref('')
const bio = ref('')
const socialLinks = ref({
  twitter: '',
  github: '',
  website: ''
})

// 🌟 Lors du montage du composant, on remplit les champs
onMounted(async () => {
  await fetchProfile()
  
  // 🌟 On vérifie bien que les données existent avant de remplir
  if (profile.value) {
    username.value = profile.value.username
    avatarUrl.value = profile.value.avatarUrl
    bio.value = profile.value.bio
    socialLinks.value = profile.value.socialLinks || {
      twitter: '',
      github: '',
      website: ''
    }
  }
})

const handleUpdate = async () => {
  await updateProfile({
    username: username.value,
    avatarUrl: avatarUrl.value,
    bio: bio.value,
    socialLinks: socialLinks.value,
  })
}
</script>
