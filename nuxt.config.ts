// nuxt.config.ts
export default defineNuxtConfig({
  // Define global CSS
  css: ['@/assets/global.css'],

  // Enable auto-imports for components (enabled by default in Nuxt 3)
  components: true,

  // Add any build or runtime configuration
  build: {
    transpile: [], // Add dependencies to transpile if needed
  },

  // Global head (metadata for your app)
  app: {
    head: {
      title: 'Open Bar Tab',
      meta: [
        { name: 'description', content: 'A web app for managing open bar tabs' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  // Enable devtools during development
  devtools: { enabled: true },

  // Runtime configuration (if required)
  runtimeConfig: {
    public: {
      apiBase: '/api', // Example public runtime config
    },
  },

  compatibilityDate: '2024-12-30',
});