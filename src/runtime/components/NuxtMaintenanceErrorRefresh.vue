<script setup lang="ts">
import { computed } from 'vue'
import { useMaintenanceErrorContext } from './maintenance-error-context'

const context = useMaintenanceErrorContext('NuxtMaintenanceErrorRefresh')
const refresh = computed(() => context?.refresh.value)
const unit = computed(() => refresh.value === 1 ? 'second' : 'seconds')
</script>

<template>
  <template v-if="refresh !== undefined">
    <slot
      v-if="$slots.default"
      :refresh="refresh"
    />
    <p v-else>
      This page will refresh in {{ refresh }} {{ unit }}.
    </p>
  </template>
</template>
