<script setup lang="ts">
const props = defineProps<{ error: unknown }>()
const genericError = computed(() => props.error as { statusCode?: number, message?: string })
</script>

<template>
  <div class="shell">
    <main class="page">
      <NuxtMaintenanceError
        v-if="isMaintenanceError(props.error)"
        :error="props.error"
      >
        <NuxtMaintenanceErrorTitle />
        <NuxtMaintenanceErrorMessage />
        <NuxtMaintenanceErrorSince />
        <NuxtMaintenanceErrorRetryAfter />
        <NuxtMaintenanceErrorRefresh />
      </NuxtMaintenanceError>
      <template v-else>
        <p class="eyebrow">
          Application error
        </p>
        <h1>{{ genericError.statusCode || 500 }}</h1>
        <p class="lede">
          {{ genericError.message || 'Something went wrong.' }}
        </p>
      </template>
      <button
        type="button"
        @click="clearError({ redirect: '/' })"
      >
        Return home
      </button>
    </main>
  </div>
</template>
