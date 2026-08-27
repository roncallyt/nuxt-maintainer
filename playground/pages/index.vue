<script setup lang="ts">
const apiResult = ref('Not requested yet.')
const { data: status, refresh: refreshStatus } = await useFetch('/_nuxt-maintainer/status')

async function callApi() {
  try {
    apiResult.value = JSON.stringify(await $fetch('/api/ping'), null, 2)
  } catch (error) {
    const response = (error as { data?: unknown }).data
    apiResult.value = JSON.stringify(response || error, null, 2)
  }
}
</script>

<template>
  <main class="page">
    <p class="eyebrow">
      Local feature harness
    </p>
    <h1>Test maintenance without another app.</h1>
    <p class="lede">
      Keep this development server running, execute the commands below in a second terminal, and refresh or navigate. State changes are read live from the filesystem.
    </p>

    <section
      class="grid"
      aria-label="Application maintenance tests"
    >
      <article class="card">
        <h2>Site status</h2>
        <p>The internal endpoint stays available while the site is down.</p>
        <code class="command">node bin/nuxt-maintainer.mjs status --cwd playground --json</code>
        <button
          type="button"
          @click="refreshStatus()"
        >
          Refresh status
        </button>
        <pre class="result">{{ status }}</pre>
      </article>

      <article class="card">
        <h2>HTML 503</h2>
        <p>Run this, then open “URL test” to confirm the requested path remains unchanged.</p>
        <code class="command">node bin/nuxt-maintainer.mjs down --cwd playground --message "Deploying the playground" --retry 120 --refresh 30</code>
        <p><code class="command">node bin/nuxt-maintainer.mjs up --cwd playground</code></p>
      </article>

      <article class="card">
        <h2>Secret bypass</h2>
        <p>The command prints a secret path. Visit it to receive the bypass cookie and return here.</p>
        <code class="command">node bin/nuxt-maintainer.mjs down --cwd playground --with-secret</code>
      </article>

      <article class="card">
        <h2>JSON API</h2>
        <p>While up this returns <code>{ pong: true }</code>. To see the structured 503 while down, use the curl command from another terminal.</p>
        <code class="command">curl -i -H 'Accept: application/json' http://localhost:3000/api/ping</code>
        <button
          type="button"
          @click="callApi"
        >
          Call /api/ping
        </button>
        <pre class="result">{{ apiResult }}</pre>
      </article>
    </section>

    <section
      class="grid section-grid"
      aria-label="Named section maintenance tests"
    >
      <NuxtMaintenance section="checkout">
        <article class="card">
          <h2>Checkout is available</h2>
          <p>Put only this boundary down without affecting the rest of the page.</p>
          <code class="command">node bin/nuxt-maintainer.mjs section down checkout --cwd playground --message "Checkout upgrade"</code>
          <p><code class="command">node bin/nuxt-maintainer.mjs section up checkout --cwd playground</code></p>
        </article>

        <template #fallback="{ section, message, since }">
          <article class="card fallback">
            <h2>{{ section }} is paused</h2>
            <p>{{ message }}</p>
            <small>Since {{ since }}</small>
          </article>
        </template>
      </NuxtMaintenance>

      <article class="card">
        <h2>Accessible default fallback</h2>
        <p>This boundary intentionally has no fallback slot.</p>
        <code class="command">node bin/nuxt-maintainer.mjs section down inventory --cwd playground</code>
        <NuxtMaintenance section="inventory">
          <p>Inventory is available.</p>
        </NuxtMaintenance>
        <p><code class="command">node bin/nuxt-maintainer.mjs section up inventory --cwd playground</code></p>
      </article>
    </section>
  </main>
</template>

<style scoped>
.section-grid {
  margin-top: 1rem;
}
</style>
