<script setup lang="ts">
import { computed } from 'vue'
import { useMaintenanceErrorContext } from './maintenance-error-context'

const context = useMaintenanceErrorContext('NuxtMaintenanceErrorRetryAfter')
const retryAfter = computed(() => context?.retryAfter.value)
const unit = computed(() => retryAfter.value === 1 ? 'second' : 'seconds')
</script>

<template>
  <template v-if="retryAfter !== undefined">
    <slot
      v-if="$slots.default"
      :retry-after="retryAfter"
    />
    <p v-else>
      Try again in {{ retryAfter }} {{ unit }}.
    </p>
  </template>
</template>
