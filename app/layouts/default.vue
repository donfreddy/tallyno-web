<script setup lang="ts">
const { public: { marketingUrl } } = useRuntimeConfig()
const installUrl = new URL('/telecharger/', marketingUrl).href
</script>

<template>
  <div class="min-h-dvh flex flex-col">
    <header class="bg-petrol-900 text-white [&_:focus-visible]:outline-petrol-300">
      <div class="max-w-lg mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <a :href="marketingUrl" class="flex items-center gap-2 font-bold tracking-tight" rel="noopener">
          <BrandMark :size="26" />
          Tallyno
        </a>
        <a
          :href="installUrl"
          rel="noopener"
          class="text-sm font-semibold rounded-full bg-white text-petrol-900 px-3.5 py-1.5 hover:bg-petrol-50"
        >
          Installer l'app
        </a>
      </div>
    </header>

    <main class="flex-1 w-full max-w-lg mx-auto px-4 pt-5 pb-10">
      <slot />
    </main>

    <footer class="border-t border-zinc-200 bg-white">
      <div class="max-w-lg mx-auto px-4 py-5 text-sm text-zinc-500">
        <p>Tallyno note les paiements entre proches. L'argent ne passe jamais par nous.</p>
        <p class="mt-1">
          <a :href="marketingUrl" rel="noopener" class="font-semibold text-petrol-600 hover:underline">Découvrir Tallyno</a>
        </p>
      </div>
    </footer>
  </div>
</template>
