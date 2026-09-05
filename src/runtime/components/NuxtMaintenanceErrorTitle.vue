<script setup lang="ts">
import { useMaintenanceErrorContext } from './maintenance-error-context'

const context = useMaintenanceErrorContext('NuxtMaintenanceErrorTitle')
</script>

<template>
  <template v-if="context">
    <slot v-if="$slots.default" />
    <h1 v-else>
      Temporarily unavailable
    </h1>
  </template>
</template>
