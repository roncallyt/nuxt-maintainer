<script setup lang="ts">
import { computed } from 'vue'
import { getMaintenanceErrorData } from '../core/error'

const props = defineProps<{ error: unknown }>()
const maintenance = computed(() => getMaintenanceErrorData(props.error)?.maintenance as { message?: string, since?: string } | undefined)
</script>

<template>
  <main
    v-if="maintenance"
    role="main"
  >
    <h1>Temporarily unavailable</h1>
    <p role="status">
      {{ maintenance.message }}
    </p>
    <p v-if="maintenance.since">
      Maintenance began <time :datetime="maintenance.since">{{ maintenance.since }}</time>.
    </p>
  </main>
</template>
