<script setup lang="ts">
import { computed } from 'vue'
import { useMaintenanceErrorContext } from './maintenance-error-context'

const context = useMaintenanceErrorContext('NuxtMaintenanceErrorSince')
const since = computed(() => context?.since.value)
</script>

<template>
  <template v-if="since !== undefined">
    <slot
      v-if="$slots.default"
      :since="since"
    />
    <p v-else>
      Maintenance began <time :datetime="since">{{ since }}</time>.
    </p>
  </template>
</template>
