<template>
  <nav class="bg-gray-900 text-white p-4 flex justify-between items-center">
    <div class="text-2xl font-bold">
      <NuxtLink to="/">Nebula</NuxtLink>
    </div>

    <div class="flex items-center gap-4">
      <!-- 🌟 Menu projets avec UDropdownMenu -->
      <UDropdownMenu
        v-if="isAuthenticated"
        :items="items"
        :content="{ align: 'start', side: 'bottom', sideOffset: 8 }"
        :ui="{ content: 'w-56' }"
      >
        <UButton label="Projets" variant="ghost" icon="i-lucide-chevron-down" />

        <!-- SLOT pour gérer le clic manuellement -->
        <template #item="{ item }">
          <div
            class="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            @click="handleItemClick(item)"
          >
            <UIcon :name="item.icon" class="w-4 h-4 text-gray-500" />
            <span>{{ item.label }}</span>
          </div>
        </template>
      </UDropdownMenu>

      <!-- Si l'utilisateur est connecté -->
      <div v-if="isAuthenticated" class="flex items-center gap-4">
        <span class="transition-opacity duration-300">
         {{ profile?.username || '...' }}
        </span>

        <NuxtLink to="/profile" class="text-white hover:text-gray-400 ml-2">
          Mon Profil
        </NuxtLink>

        <UButton
          size="sm"
          class="bg-red-600 hover:bg-red-700 text-white ml-2"
          @click="logout"
        >
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

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const isAuthenticated = computed(() => userStore.isLoggedIn)
const profile = computed(() => userStore.getProfile)
const role = computed(() => userStore.getUser?.role)

const items = computed(() => {
  const base = [
    {
      label: 'Explorer',
      icon: 'i-lucide-compass',
      route: '/projects'
    }
  ]

  if (role.value === 'CREATOR') {
    base.unshift(
      {
        label: 'Mes projets',
        icon: 'i-lucide-folder',
        route: '/projects/mine'
      }
    )
  }

  return base
})

const handleItemClick = (item: any) => {
  if (item.route) {
    router.push(item.route)
  }
}

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
