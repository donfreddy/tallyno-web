<script setup lang="ts">
defineProps<{ text: string }>()
const { public: { marketingUrl } } = useRuntimeConfig()
const installUrl = new URL('/telecharger/', marketingUrl).href
</script>

<template>
  <aside class="flex items-center gap-3 rounded-2xl bg-petrol-50 ring-1 ring-petrol-100 p-4">
    <BrandMark :size="40" />
    <p class="flex-1 text-sm text-petrol-900">{{ text }}</p>
    <a
      :href="installUrl"
      rel="noopener"
      class="shrink-0 rounded-full bg-petrol-600 text-white text-sm font-semibold px-3.5 py-2 hover:bg-petrol-700"
    >
      Installer
    </a>
  </aside>
</template>
