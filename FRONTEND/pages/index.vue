<template>
  <div
    class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#0B0F29] to-[#1A1F3D] text-white"
  >
    <div class="text-center space-y-6">
      <h1
        class="text-5xl font-bold bg-gradient-to-r from-[#FF5EDB] to-[#00F0FF] text-transparent bg-clip-text"
      >
        Bienvenue sur Nébula
      </h1>
      <p class="text-lg max-w-xl mx-auto">
        Découvrez, jouez et soutenez les jeux vidéos indépendants comme jamais
        auparavant. Rejoignez notre communauté et participez à l'évolution du
        gaming.
      </p>
      <div class="flex gap-4 justify-center mt-6">
        <UButton
          to="/register"
          size="lg"
          class="bg-gradient-to-r from-[#FF5EDB] to-[#00F0FF] text-black"
        >
          Créer un compte
        </UButton>
        <UButton
          to="/login"
          size="lg"
          class="bg-gradient-to-r from-[#FF5EDB] to-[#00F0FF] text-black"
        >
          Se connecter
        </UButton>
      </div>
    </div>

    <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 px-8 max-w-5xl">
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">Pourquoi choisir Nébula ?</h2>
        <p>
          Nébula est une plateforme innovante dédiée aux développeurs de jeux
          indépendants. Publiez vos projets, trouvez des partenaires, et laissez
          la communauté découvrir votre univers.
        </p>
      </div>
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold mb-4">Une expérience unique</h2>
        <p>
          Grâce à notre système de soutien communautaire, les joueurs peuvent
          contribuer à l'évolution des jeux et recevoir des récompenses
          exclusives.
        </p>
      </div>
    </div>
  </div>
</template>
