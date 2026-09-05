<script setup lang="ts">
import { provide } from 'vue'
import { useNuxtMaintenanceError } from '../composables/useNuxtMaintenanceError'
import NuxtMaintenanceErrorMessage from './NuxtMaintenanceErrorMessage.vue'
import NuxtMaintenanceErrorSince from './NuxtMaintenanceErrorSince.vue'
import NuxtMaintenanceErrorTitle from './NuxtMaintenanceErrorTitle.vue'
import { maintenanceErrorContextKey } from './maintenance-error-context'

const props = defineProps<{ error: unknown }>()
const context = useNuxtMaintenanceError(() => props.error)
const { state, message, since, retryAfter, refresh } = context

provide(maintenanceErrorContextKey, context)
</script>

<template>
  <template v-if="state">
    <slot
      v-if="$slots.default"
      :state="state"
      :message="message"
      :since="since"
      :retry-after="retryAfter"
      :refresh="refresh"
    />
    <main
      v-else
      role="main"
    >
      <NuxtMaintenanceErrorTitle />
      <NuxtMaintenanceErrorMessage />
      <NuxtMaintenanceErrorSince />
    </main>
  </template>
</template>
