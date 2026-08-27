<script setup lang="ts">
import { useNuxtMaintenance } from '../composables/useNuxtMaintenance'

const props = defineProps<{ section: string }>()
const { isDown, message, since } = await useNuxtMaintenance(props.section)
</script>

<template>
  <slot v-if="!isDown" />
  <slot
    v-else-if="$slots.fallback"
    name="fallback"
    :section="section"
    :message="message"
    :since="since"
  />
  <p
    v-else
    role="status"
    aria-live="polite"
  >
    {{ message }}
  </p>
</template>
