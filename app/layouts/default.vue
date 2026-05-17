<template>
  <div class="min-h-screen bg-zinc-50">
    <!-- Header minimal -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <div class="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-7 h-7 bg-purple-700 rounded-lg flex items-center justify-center">
            <span class="text-white text-xs font-bold font-mono">T</span>
          </div>
          <span class="font-semibold text-purple-800 tracking-tight">Tallyno</span>
        </NuxtLink>

        <!-- CTA download -->
        <UButton label="Télécharger l'app" size="sm" color="neutral" variant="outline"
          class="rounded-full cursor-pointer" />
      </div>
    </header>

    <!-- Page content -->
    <main>
      <slot />
    </main>

    <!-- Footer minimaliste -->
    <footer class="mt-12 pb-8 text-center">
      <p class="text-xs text-zinc-400 font-mono">
        Géré avec <span class="text-purple-700 font-medium">Tallyno</span> • Dépenses sans disputes
      </p>
    </footer>
  </div>
</template>