export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: '2026-08-26',
  maintainer: {
    exclude: ['/health'],
    defaultMessage: 'The playground is receiving an update.',
    sectionDefaultMessage: 'This playground feature is temporarily unavailable.',
  },
})
