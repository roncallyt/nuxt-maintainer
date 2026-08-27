import { createError, defineNuxtRouteMiddleware, useRequestEvent } from '#imports'
import type { RouteMiddleware } from '#app'
import type { PublicMaintenanceState } from '../../types'

let lastFetchWarning = 0

const maintenanceMiddleware: RouteMiddleware = defineNuxtRouteMiddleware(async () => {
  let state: PublicMaintenanceState | undefined
  if (import.meta.server) {
    const event = useRequestEvent()
    const context = event?.context.nuxtMaintainer as { site?: PublicMaintenanceState, bypassed?: boolean } | undefined
    if (context?.bypassed) return
    state = context?.site
  } else {
    try {
      const response = await $fetch<{ site: PublicMaintenanceState, bypassed?: boolean }>('/_nuxt-maintainer/status')
      if (response.bypassed) return
      state = response.site
    } catch (error) {
      if (Date.now() - lastFetchWarning >= 60_000) {
        lastFetchWarning = Date.now()
        console.error('[nuxt-maintainer] Maintenance status could not be refreshed; navigation will fail open.', error)
      }
      return
    }
  }

  if (state?.down) {
    throw createError({
      fatal: true,
      statusCode: 503,
      statusMessage: 'Service Unavailable',
      message: state.message,
      data: { code: 'NUXT_MAINTAINER', maintenance: state },
    })
  }
})

export default maintenanceMiddleware
