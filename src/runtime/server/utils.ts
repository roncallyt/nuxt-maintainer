import { getCookie, getHeader, setResponseHeader, type H3Event } from 'h3'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'
import type { MaintenanceRecord, PublicMaintenanceState } from '../../types'
import type { MaintenanceStorage } from '../core/storage'
import { BYPASS_COOKIE, DEFAULT_KEY_PREFIX, DEFAULT_MESSAGE, DEFAULT_MOUNT, DEFAULT_SECTION_MESSAGE } from '../core/state'
import { bypassCookieValue, constantEqual } from '../core/secret'
import { matchesRoutePattern } from '../core/routes'

export interface RuntimeMaintainerConfig {
  mount: string
  keyPrefix: string
  exclude: string[]
  defaultMessage: string
  sectionDefaultMessage: string
}

export interface RequestMaintenanceContext {
  site: PublicMaintenanceState
  record?: MaintenanceRecord
  bypassed: boolean
}

let lastStorageWarning = 0

export function getMaintainerConfig(event: H3Event): RuntimeMaintainerConfig {
  const value = useRuntimeConfig(event).maintainer as Partial<RuntimeMaintainerConfig> | undefined
  return {
    mount: value?.mount || DEFAULT_MOUNT,
    keyPrefix: value?.keyPrefix || DEFAULT_KEY_PREFIX,
    exclude: Array.isArray(value?.exclude) ? value.exclude : [],
    defaultMessage: value?.defaultMessage || DEFAULT_MESSAGE,
    sectionDefaultMessage: value?.sectionDefaultMessage || DEFAULT_SECTION_MESSAGE,
  }
}

export function getMaintenanceStorage(config: RuntimeMaintainerConfig): MaintenanceStorage {
  return useStorage(config.mount) as MaintenanceStorage
}

export function isExcludedPath(path: string, patterns: string[]) {
  if (path.startsWith('/_nuxt/') || path === '/_nuxt' || path.startsWith('/_nuxt-maintainer/')) return true
  return patterns.some(pattern => matchesRoutePattern(path, pattern))
}

export function isJsonRequest(event: H3Event, path: string) {
  if (path === '/api' || path.startsWith('/api/')) return true
  const accept = getHeader(event, 'accept') || ''
  const contentType = getHeader(event, 'content-type') || ''
  return accept.includes('application/json') || contentType.includes('application/json')
}

export function applyMaintenanceHeaders(event: H3Event, record: MaintenanceRecord) {
  if (record.retryAfter) setResponseHeader(event, 'Retry-After', record.retryAfter)
  if (record.refresh) setResponseHeader(event, 'Refresh', String(record.refresh))
}

export function hasValidBypassCookie(event: H3Event, record: MaintenanceRecord) {
  if (!record.secretHash) return false
  const cookie = getCookie(event, BYPASS_COOKIE)
  return Boolean(cookie && constantEqual(cookie, bypassCookieValue(record.secretHash)))
}

export function warnStorageFailure(error: unknown) {
  const now = Date.now()
  if (now - lastStorageWarning < 60_000) return
  lastStorageWarning = now
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[nuxt-maintainer] Maintenance state is unavailable; requests will fail open. ${message}`)
}
