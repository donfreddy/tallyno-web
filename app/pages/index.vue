<script setup lang="ts">
// This app only serves shared recaps (/s/, /g/). Anyone landing on the root
// is looking for Tallyno itself: send them to the marketing site.
const { public: { marketingUrl } } = useRuntimeConfig()
await navigateTo(marketingUrl, { external: true, redirectCode: 302 })
</script>

<template>
  <div />
</template>
