<script setup lang="ts">
import { useNuxtMaintenanceError } from '../../../src/runtime/composables/useNuxtMaintenanceError'
import { isMaintenanceError } from '../../../src/runtime/core/error'

const props = defineProps<{ error: unknown }>()
const { message } = useNuxtMaintenanceError(() => props.error)
</script>

<template>
  <NuxtMaintenanceError
    v-if="isMaintenanceError(props.error) && message === 'Compound maintenance'"
    :error="props.error"
  >
    <main id="compound-error">
      <NuxtMaintenanceErrorTitle>
        <h2>Custom maintenance title</h2>
      </NuxtMaintenanceErrorTitle>
      <NuxtMaintenanceErrorMessage v-slot="{ message: maintenanceMessage }">
        <div id="custom-message">
          {{ maintenanceMessage }}
        </div>
      </NuxtMaintenanceErrorMessage>
      <NuxtMaintenanceErrorRefresh />
      <NuxtMaintenanceErrorSince />
      <NuxtMaintenanceErrorRetryAfter v-slot="{ retryAfter }">
        <data
          id="custom-retry"
          :value="retryAfter"
        >{{ retryAfter }}</data>
      </NuxtMaintenanceErrorRetryAfter>
    </main>
  </NuxtMaintenanceError>
  <NuxtMaintenanceError
    v-else-if="isMaintenanceError(props.error)"
    :error="props.error"
  />
  <div
    v-else
    id="existing-error"
  >
    Existing error page
  </div>
</template>
