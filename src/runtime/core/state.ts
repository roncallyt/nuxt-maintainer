import type { MaintenanceRecord, PublicMaintenanceState } from '../../types'

export const DEFAULT_MOUNT = 'maintainer'
export const DEFAULT_KEY_PREFIX = 'nuxt-maintainer'
export const DEFAULT_MESSAGE = 'The application is currently unavailable while maintenance is in progress.'
export const DEFAULT_SECTION_MESSAGE = 'This part of the application is temporarily unavailable.'
export const BYPASS_COOKIE = 'nuxt-maintainer-bypass'
export const INTERNAL_PATH = '/_nuxt-maintainer'
export const SECTION_NAME_RE = /^[a-z0-9][a-z0-9._-]*$/

export const siteKey = (prefix = DEFAULT_KEY_PREFIX) => `${prefix}:site`
export const sectionKey = (name: string, prefix = DEFAULT_KEY_PREFIX) => `${prefix}:sections:${name}`
export const sectionsBase = (prefix = DEFAULT_KEY_PREFIX) => `${prefix}:sections:`

export function isMaintenanceRecord(value: unknown): value is MaintenanceRecord {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return record.version === 1
    && typeof record.message === 'string'
    && typeof record.since === 'string'
    && (record.retryAfter === undefined || isPositiveInteger(record.retryAfter))
    && (record.refresh === undefined || isPositiveInteger(record.refresh))
    && (record.secretHash === undefined || typeof record.secretHash === 'string')
}

export function publicState(record: MaintenanceRecord | null | undefined): PublicMaintenanceState {
  if (!record) return { down: false }
  return {
    down: true,
    message: record.message,
    since: record.since,
    ...(record.retryAfter === undefined ? {} : { retryAfter: record.retryAfter }),
    ...(record.refresh === undefined ? {} : { refresh: record.refresh }),
  }
}

export function assertSectionName(name: string) {
  if (!SECTION_NAME_RE.test(name)) {
    throw new Error('Section names must be lowercase and contain only letters, numbers, dots, underscores, or hyphens.')
  }
}

export function parsePositiveInteger(value: unknown, flag: string): number | undefined {
  if (value === undefined || value === false || value === '') return undefined
  const number = Number(value)
  if (!isPositiveInteger(number)) throw new Error(`${flag} must be a positive integer.`)
  return number
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0
}
