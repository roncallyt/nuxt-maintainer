import { computed, useAsyncData, useRequestFetch, useRoute, watch } from '#imports'
import type { ComputedRef, Ref } from 'vue'
import type { MaintenanceStatus, PublicMaintenanceState } from '../../types'
import { assertSectionName } from '../core/state'

export interface UseNuxtMaintenanceReturn {
  state: ComputedRef<PublicMaintenanceState>
  isDown: ComputedRef<boolean>
  message: ComputedRef<string | undefined>
  since: ComputedRef<string | undefined>
  pending: Ref<boolean>
  error: Ref<unknown>
  refresh: () => Promise<void>
}

export async function useNuxtMaintenance(section?: string): Promise<UseNuxtMaintenanceReturn> {
  if (section) assertSectionName(section)
  const route = useRoute()
  const requestFetch = import.meta.server ? useRequestFetch() : $fetch
  const key = section ? `nuxt-maintainer:section:${section}` : 'nuxt-maintainer:site'
  const result = await useAsyncData(key, async () => {
    const response = await requestFetch<MaintenanceStatus>('/_nuxt-maintainer/status', {
      query: section ? { section } : undefined,
    })
    return section ? response.sections?.[section] || { down: false } : response.site
  }, { default: () => ({ down: false }) as PublicMaintenanceState })

  if (import.meta.client) watch(() => route.fullPath, () => result.refresh())
  const state = computed(() => result.data.value || { down: false })
  return {
    state,
    isDown: computed(() => state.value.down),
    message: computed(() => state.value.message),
    since: computed(() => state.value.since),
    pending: result.pending,
    error: result.error,
    refresh: async () => {
      await result.refresh()
    },
  }
}
