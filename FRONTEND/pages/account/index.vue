<template>
  <div class="p-8 max-w-xl mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Mon Profil</h1>
      <UButton v-if="!isEditing" size="sm" @click="isEditing = true">
        Modifier
      </UButton>
    </div>

    <!-- 🌟 Vue d'affichage (Lecture seule) -->
    <div v-if="!isEditing" class="space-y-4">
      <div class="flex items-center gap-4">
        <UAvatar
          size="3xl"
          src="https://avatars.githubusercontent.com/u/739984?v=4"
          alt="Avatar"
        />
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-semibold">{{ username }}</h2>
            <UBadge v-if="isCreator" label="Créateur" />
          </div>
          <p class="text-gray-400">{{ bio }}</p>
        </div>
      </div>

      <div class="mt-4">
        <h3 class="text-lg font-semibold">Liens sociaux :</h3>
        <ul class="list-disc pl-5">
          <li v-if="socialLinks.twitter">
            Twitter :
            <a
              :href="socialLinks.twitter"
              class="text-blue-500"
              target="_blank"
              >{{ socialLinks.twitter }}</a
            >
          </li>
          <li v-if="socialLinks.github">
            GitHub :
            <a
              :href="socialLinks.github"
              class="text-blue-500"
              target="_blank"
              >{{ socialLinks.github }}</a
            >
          </li>
          <li v-if="socialLinks.website">
            Site Web :
            <a
              :href="socialLinks.website"
              class="text-blue-500"
              target="_blank"
              >{{ socialLinks.website }}</a
            >
          </li>
        </ul>
      </div>

      <!-- 🌟 Bouton de passage en Créateur -->
      <div class="mt-6">
        <UButton
          class="bg-green-600 hover:bg-green-700 text-white"
          :disabled="loading"
          @click="confirmSwitchToCreator"
        >
          <template v-if="!loading"> Passer en mode Créateur </template>
        </UButton>
      </div>
    </div>

    <!-- 🌟 Vue d'édition (Formulaire) -->
    <form v-else class="space-y-4" @submit.prevent="handleUpdate">
      <UInput v-model="username" placeholder="Nom d'utilisateur" required />
      <UInput v-model="avatarUrl" placeholder="URL de l'avatar" />
      <UTextarea v-model="bio" placeholder="Votre bio" />

      <h2 class="text-lg font-semibold mt-4">Liens sociaux :</h2>
      <UInput v-model="socialLinks.twitter" placeholder="Twitter" />
      <UInput v-model="socialLinks.github" placeholder="GitHub" />
      <UInput v-model="socialLinks.website" placeholder="Site Web" />

      <div class="flex gap-4">
        <UButton :disabled="loading" type="submit" class="w-full">
          <template v-if="!loading"> Enregistrer les modifications </template>
        </UButton>

        <UButton class="w-full bg-gray-600" @click="cancelEdit">
          Annuler
        </UButton>
      </div>
    </form>

    <!-- 🌟 Bouton de suppression de compte -->
    <UModal class="mt-6">
      <UButton class="text-white" label="Supprimer mon compte" color="error" />

      <template #content>
        <div class="p-4 space-y-4">
          <p class="text-red-600">
            ⚠️ Cette action est irréversible. Entrez votre mot de passe pour
            confirmer :
          </p>

          <UInput
            v-model="password"
            type="password"
            placeholder="Mot de passe"
            required
          />

          <UInput
            v-if="userStore.getUser?.isTotpEnabled"
            v-model="totpToken"
            placeholder="Code 2FA (si activé)"
          />

          <div class="flex justify-end gap-4 mt-4">
            <UButton
              color="red"
              :disabled="loading"
              @click="handleDeleteAccount"
            >
              <template v-if="!loading"> Confirmer </template>
            </UButton>
          </div>

          <transition name="fade">
            <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
          </transition>
        </div>
      </template>
    </UModal>

    <transition name="fade">
      <div v-if="success" class="text-green-500 mt-4">{{ success }}</div>
    </transition>

    <transition name="fade">
      <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useProfileService } from "@/services/profileService";
import { useUserStore } from "@/stores/userStore";

const {
  updateProfile,
  switchToCreator,
  deleteAccount,
  loading,
  error,
  success,
} = useProfileService();
const userStore = useUserStore();

// 🌟 Champs de formulaire
const isEditing = ref(false);
const password = ref("");
const totpToken = ref("");
const profile = computed(() => userStore.getProfile);
const isCreator = computed(() => userStore.getUser?.role === "CREATOR");
const username = ref(profile.value?.username || "");
const avatarUrl = ref(profile.value?.avatarUrl || "");
const bio = ref(profile.value?.bio || "");
const socialLinks = ref(
  profile.value?.socialLinks || {
    twitter: "",
    github: "",
    website: "",
  }
);

// 🌟 Vérification si l'utilisateur est chargé
onMounted(() => {
  if (!userStore.getUser) {
    userStore.loadUserFromStorage();
  }
});

const handleUpdate = async () => {
  await updateProfile({
    username: username.value,
    avatarUrl: avatarUrl.value,
    bio: bio.value,
    socialLinks: socialLinks.value,
  });

  // 🌟 Si le profil est mis à jour, on synchronise le store
  if (!error.value) {
    const updatedUser = {
      ...userStore.getUser,
      profile: {
        username: username.value,
        avatarUrl: avatarUrl.value,
        bio: bio.value,
        socialLinks: socialLinks.value,
      },
    };
    userStore.setUser(updatedUser);
    isEditing.value = false; // ➡️ On repasse en mode lecture
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  username.value = profile.value?.username || "";
  avatarUrl.value = profile.value?.avatarUrl || "";
  bio.value = profile.value?.bio || "";
  socialLinks.value = profile.value?.socialLinks || {
    twitter: "",
    github: "",
    website: "",
  };
};

// 🔄 Méthode pour confirmer la suppression
const handleDeleteAccount = async () => {
  await deleteAccount(password.value, totpToken.value);
  if (success.value) {
    alert("Votre compte a été supprimé avec succès.");
    window.location.href = "/"; // Redirection vers l'accueil
  }
};

const confirmSwitchToCreator = async () => {
  if (confirm("Voulez-vous vraiment passer en mode Créateur ?")) {
    await switchToCreator();
    userStore.setUser({
      ...userStore.getUser,
      role: "CREATOR",
    });
    console.log("Le rôle est passé à :", userStore.getUser.role);
  }
};
</script>
