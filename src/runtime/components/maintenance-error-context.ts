import { inject } from 'vue'
import type { InjectionKey } from 'vue'
import type { UseNuxtMaintenanceErrorReturn } from '../composables/useNuxtMaintenanceError'

export const maintenanceErrorContextKey: InjectionKey<UseNuxtMaintenanceErrorReturn> = Symbol('nuxt-maintenance-error')

export function useMaintenanceErrorContext(component: string) {
  const context = inject(maintenanceErrorContextKey, null)
  if (!context) {
    console.warn(`[nuxt-maintainer] <${component}> must be used inside <NuxtMaintenanceError>.`)
  }
  return context
}
