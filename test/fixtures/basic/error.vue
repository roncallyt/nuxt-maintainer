<script setup lang="ts">
import { isMaintenanceError } from '../../../src/runtime/core/error'

const props = defineProps<{ error: unknown }>()
</script>

<template>
  <NuxtMaintenanceError
    v-if="isMaintenanceError(props.error)"
    :error="props.error"
  />
  <div
    v-else
    id="existing-error"
  >
    Existing error page
  </div>
</template>
