export interface NuxtMaintenanceErrorData {
  code?: string
  maintenance?: unknown
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
  if (data?.code === 'NUXT_MAINTAINER') return data
  return value.cause !== error ? getMaintenanceErrorData(value.cause) : null
}

function parseData(value: unknown): NuxtMaintenanceErrorData | null {
  if (value && typeof value === 'object') return value as NuxtMaintenanceErrorData
  if (typeof value !== 'string') return null
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? parsed as NuxtMaintenanceErrorData : null
  } catch {
    return null
  }
}
