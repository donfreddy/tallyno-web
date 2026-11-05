<script setup lang="ts">
/** Full-page message for expired, unknown or unreachable links. */
defineProps<{ title: string; text: string }>()
const { public: { marketingUrl } } = useRuntimeConfig()
const installUrl = new URL('/telecharger/', marketingUrl).href
</script>

<template>
  <section class="pt-10 text-center">
    <BrandMark :size="44" class="mx-auto" />
    <h1 class="mt-5 text-2xl font-bold tracking-tight">{{ title }}</h1>
    <p class="mt-2 text-zinc-600 max-w-xs mx-auto">{{ text }}</p>
    <a
      :href="installUrl"
      rel="noopener"
      class="mt-6 inline-block rounded-full bg-petrol-600 text-white font-semibold px-5 py-3 hover:bg-petrol-700"
    >
      Ouvrir dans l'app Tallyno
    </a>
  </section>
</template>
