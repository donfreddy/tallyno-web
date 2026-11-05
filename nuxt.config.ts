// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      titleTemplate: '%s · Tallyno',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#003237' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  routeRules: {
    '/s/**': { ssr: true },
    '/g/**': { ssr: true },
    // Recaps carry names and amounts: keep them out of search engines, and
    // never leak the token in the Referer when someone follows a link out.
    '/**': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
        'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff',
        // Names and amounts must not sit in a shared cache, nor in a frame.
        'Cache-Control': 'private, no-store',
        'Content-Security-Policy': "frame-ancestors 'none'",
        'X-Frame-Options': 'DENY',
      },
    },
  },
  colorMode: {
    preference: 'light',
  },
  runtimeConfig: {
    // Base URL of the NestJS API (used by the server/ proxy routes).
    // Override with NUXT_API_BASE (or API_BASE_URL at build time).
    apiBase: process.env.API_BASE_URL || 'http://localhost:3000',
    public: {
      // Public origin of this app, for absolute Open Graph URLs.
      siteUrl: 'https://tallyno.lehmora.com',
      // Marketing site: the root of this app redirects there.
      marketingUrl: 'https://tallyno.lehmora.com',
    },
  },
})
