# Nuxt Maintainer

Laravel-inspired, live maintenance mode for Nuxt 3.21 and Nuxt 4.

```bash
npx nuxi module add nuxt-maintainer
npx nuxt-maintainer down --message "Back shortly"
npx nuxt-maintainer up
```

Features include URL-preserving 503 errors through Nuxt's error pipeline, structured API responses, filesystem and shared Redis state, hashed secret bypass URLs, route exclusions, response headers, and named maintenance sections.

```vue
<NuxtMaintenance section="checkout">
  <Checkout />
  <template #fallback="{ message }">
    <CheckoutUnavailable :message="message" />
  </template>
</NuxtMaintenance>
```

Read the full documentation at [nuxt-maintainer.t7n.dev](https://nuxt-maintainer.t7n.dev).

## Development

```bash
npm install
npm run dev:prepare
npm run lint
npm run test:types
npm test
npm run prepack
```

MIT License
