<template>
  <nav class="bg-gray-900 text-white p-4 flex justify-between items-center">
    <div class="text-2xl font-bold">
      <NuxtLink to="/">Nebula</NuxtLink>
    </div>

    <div class="flex items-center gap-4">
      <NuxtLink to="/projects">
        <UButton label="Jeux" variant="ghost" />
      </NuxtLink>

      <!-- ✅ Menu utilisateur -->
      <UPopover v-if="isAuthenticated" mode="hover">
        <div class="flex items-center gap-2 cursor-pointer">
          <UAvatar :src="profile?.avatarUrl" size="md" alt="Avatar" />
          <span class="hidden sm:inline">{{ profile?.username || '...' }}</span>
        </div>

        <template #content>
          <ul class="flex flex-col min-w-[200px]">
            <li class="flex flex-col p-3">
              <p class="text-sm font-medium">{{ profile?.fullName || profile?.username }}</p>
              <p class="text-xs text-gray-400">{{ role }}</p>
            </li>
            <li class="p-2">
              <NuxtLink to="/account" class="w-full">
                <UButton variant="soft" icon="i-lucide-layout-dashboard" class="w-full">
                  Dashboard
                </UButton>
              </NuxtLink>
            </li>
            <li v-if="role === 'CREATOR'" class="p-2">
              <NuxtLink to="/projects/mine" class="w-full">
                <UButton variant="soft" icon="i-lucide-folder" class="w-full">
                  Mes projets
                </UButton>
              </NuxtLink>
            </li>
            <li class="p-2">
              <UButton variant="soft" color="error" icon="i-lucide-log-out" class="w-full" @click="logout">
                Déconnexion
              </UButton>
            </li>
          </ul>
        </template>
      </UPopover>

      <!-- Connexion / inscription -->
      <div v-else>
        <NuxtLink to="/login" class="text-white hover:text-gray-400">Se connecter</NuxtLink>
        <NuxtLink to="/register" class="ml-4 text-white hover:text-gray-400">S'inscrire</NuxtLink>
      </div>
    </div>
  </nav>
</template>


<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const isAuthenticated = computed(() => userStore.isLoggedIn)
const profile = computed(() => userStore.getProfile)
const role = computed(() => userStore.getUser?.role)

onMounted(() => {
  document.addEventListener('user:updated', () => {
    console.log("🚀 Profil mis à jour depuis un autre composant.")
  })
})

const logout = () => {
  userStore.clearUser()
  router.push('/login')
}
</script>
