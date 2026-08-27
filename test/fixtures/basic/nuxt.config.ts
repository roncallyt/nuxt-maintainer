import { resolve } from 'node:path'

export default defineNuxtConfig({
  modules: [
    'nuxt-maintainer',
  ],
  alias: {
    'nuxt-maintainer': resolve(__dirname, '../../../src/module.ts'),
  },
  maintainer: {
    exclude: ['/health', '/public/**'],
  },
})
