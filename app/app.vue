<script setup lang="ts">
const { public: { siteUrl } } = useRuntimeConfig()

useSeoMeta({
  title: 'Récap partagé',
  description: 'Le récap d\'une dépense ou d\'une tontine partagé avec Tallyno.',
  ogImage: new URL('/og-default.png', siteUrl).href,
  ogSiteName: 'Tallyno',
  robots: 'noindex, nofollow',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
