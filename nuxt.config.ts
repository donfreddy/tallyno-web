// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      titleTemplate: '%s · Tallyno',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0F172A' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&family=DM+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  routeRules: {
    '/s/**': { ssr: true },
    '/g/**': { ssr: true },
  },
  colorMode: {
    preference: 'light'
  },
  runtimeConfig: {
    // Base URL of the NestJS API (used by the server/ proxy routes).
    // Override with API_BASE_URL env var.
    apiBase: process.env.API_BASE_URL || 'http://localhost:3000',
  },
})
