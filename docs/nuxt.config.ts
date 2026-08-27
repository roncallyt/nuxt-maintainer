export default defineNuxtConfig({
  extends: ['docus'],
  site: { name: 'Nuxt Maintainer', url: 'https://nuxt-maintainer.t7n.dev' },
  workspaceDir: import.meta.dirname,
  compatibilityDate: '2026-08-26',
  nitro: {
    prerender: {
      routes: [
        '/getting-started',
        '/cli',
        '/error-pages',
        '/secrets',
        '/storage',
        '/exclusions',
        '/sections',
        '/migration',
      ],
    },
  },
  llms: {
    domain: 'https://nuxt-maintainer.t7n.dev',
    title: 'Nuxt Maintainer',
    description: 'Live maintenance mode for Nuxt applications.',
  },
})
