<script setup lang="ts">
import { computed } from 'vue'
import { useMaintenanceErrorContext } from './maintenance-error-context'

const context = useMaintenanceErrorContext('NuxtMaintenanceErrorMessage')
const message = computed(() => context?.message.value)
</script>

<template>
  <template v-if="message !== undefined">
    <slot
      v-if="$slots.default"
      :message="message"
    />
    <p
      v-else
      role="status"
    >
      {{ message }}
    </p>
  </template>
</template>
