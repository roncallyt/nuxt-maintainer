import type { PublicMaintenanceState } from '../../types'

export interface NuxtMaintenanceErrorData {
  code: 'NUXT_MAINTAINER'
  maintenance?: PublicMaintenanceState
}

export interface NuxtMaintenanceErrorLike {
  data?: unknown
  cause?: unknown
}

export function isMaintenanceError(error: unknown): error is NuxtMaintenanceErrorLike {
  return Boolean(getMaintenanceErrorData(error))
}

export function getMaintenanceErrorData(error: unknown): NuxtMaintenanceErrorData | null {
  if (!error || typeof error !== 'object') return null
  const value = error as NuxtMaintenanceErrorLike
  const data = parseData(value.data)
  if (data?.code === 'NUXT_MAINTAINER') {
    return {
      code: 'NUXT_MAINTAINER',
      ...(isPublicMaintenanceState(data.maintenance) ? { maintenance: data.maintenance } : {}),
    }
  }
  return value.cause !== error ? getMaintenanceErrorData(value.cause) : null
}

function parseData(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === 'object') return value as Record<string, unknown>
  if (typeof value !== 'string') return null
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null
  } catch {
    return null
  }
}

function isPublicMaintenanceState(value: unknown): value is PublicMaintenanceState {
  if (!value || typeof value !== 'object') return false
  const state = value as Record<string, unknown>
  return typeof state.down === 'boolean'
    && (state.message === undefined || typeof state.message === 'string')
    && (state.since === undefined || typeof state.since === 'string')
    && (state.retryAfter === undefined || isPositiveInteger(state.retryAfter))
    && (state.refresh === undefined || isPositiveInteger(state.refresh))
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0
}
