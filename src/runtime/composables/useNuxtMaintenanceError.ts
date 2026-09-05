import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { PublicMaintenanceState } from '../../types'
import { getMaintenanceErrorData } from '../core/error'

export interface UseNuxtMaintenanceErrorReturn {
  state: ComputedRef<PublicMaintenanceState | null>
  message: ComputedRef<string | undefined>
  since: ComputedRef<string | undefined>
  retryAfter: ComputedRef<number | undefined>
  refresh: ComputedRef<number | undefined>
}

export function useNuxtMaintenanceError(error: MaybeRefOrGetter<unknown>): UseNuxtMaintenanceErrorReturn {
  const state = computed(() => getMaintenanceErrorData(toValue(error))?.maintenance || null)

  return {
    state,
    message: computed(() => state.value?.message),
    since: computed(() => state.value?.since),
    retryAfter: computed(() => state.value?.retryAfter),
    refresh: computed(() => state.value?.refresh),
  }
}
