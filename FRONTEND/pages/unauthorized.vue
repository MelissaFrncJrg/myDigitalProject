<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center space-y-4">
      <h1 class="text-3xl font-bold text-red-600">⛔ Accès refusé</h1>
      <p class="text-gray-300">
        Cette page est réservée aux créateurs. Vous devez avoir le rôle
        <strong>CREATOR</strong> pour y accéder.
      </p>
      <UButton to="/" class="mt-4">Retour à l'accueil</UButton>
    </div>
  </div>
</template>
