import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useNuxtMaintenanceError } from '../src/runtime/composables/useNuxtMaintenanceError'
import { isMaintenanceError } from '../src/runtime/core/error'
import { matchesRoutePattern } from '../src/runtime/core/routes'
import { bypassCookieValue, constantEqual, hashSecret } from '../src/runtime/core/secret'
import { assertSectionName, isMaintenanceRecord, publicState, sectionKey, siteKey } from '../src/runtime/core/state'
import { readSite } from '../src/runtime/core/storage'
import type { MaintenanceStorage } from '../src/runtime/core/storage'

describe('state contract', () => {
  it('uses isolated stable keys', () => {
    expect(siteKey('app')).toBe('app:site')
    expect(sectionKey('checkout', 'app')).toBe('app:sections:checkout')
  })

  it('validates records and section identifiers', () => {
    expect(isMaintenanceRecord({ version: 1, message: 'Working', since: '2026-01-01T00:00:00.000Z' })).toBe(true)
    expect(() => assertSectionName('checkout.v2')).not.toThrow()
    expect(() => assertSectionName('Checkout')).toThrow(/lowercase/)
    expect(() => assertSectionName('../site')).toThrow(/lowercase/)
  })

  it('rejects corrupt records instead of treating them as down', async () => {
    const storage: MaintenanceStorage = {
      getItem: async <T>() => ({ version: 9 }) as T,
      setItem: async () => {},
      removeItem: async () => {},
      getKeys: async () => [],
    }
    await expect(readSite(storage, 'app')).rejects.toThrow('Invalid maintenance record')
  })

  it('sanitizes private state', () => {
    expect(publicState({ version: 1, message: 'Work', since: 'now', secretHash: 'private' })).toEqual({
      down: true,
      message: 'Work',
      since: 'now',
    })
  })
})

describe('secret bypass', () => {
  it('stores a deterministic hash and derives a distinct opaque cookie', () => {
    const hash = hashSecret('token')
    const cookie = bypassCookieValue(hash)
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
    expect(cookie).not.toContain(hash)
    expect(constantEqual(hashSecret('token'), hash)).toBe(true)
    expect(constantEqual(hashSecret('wrong'), hash)).toBe(false)
  })
})

describe('route exclusions', () => {
  it('distinguishes segment and recursive wildcards', () => {
    expect(matchesRoutePattern('/public/logo.svg', '/public/*')).toBe(true)
    expect(matchesRoutePattern('/public/nested/logo.svg', '/public/*')).toBe(false)
    expect(matchesRoutePattern('/public/nested/logo.svg', '/public/**')).toBe(true)
  })
})

describe('maintenance errors', () => {
  it('recognizes direct and wrapped tagged errors', () => {
    const error = { data: { code: 'NUXT_MAINTAINER' } }
    expect(isMaintenanceError(error)).toBe(true)
    expect(isMaintenanceError({ cause: error })).toBe(true)
    expect(isMaintenanceError({ data: JSON.stringify(error.data) })).toBe(true)
    expect(isMaintenanceError({ statusCode: 503 })).toBe(false)
  })

  it('exposes reactive typed maintenance state without fetching', () => {
    const fetch = vi.spyOn(globalThis, 'fetch')
    const error = ref<unknown>({
      data: {
        code: 'NUXT_MAINTAINER',
        maintenance: {
          down: true,
          message: 'Deploying',
          since: '2026-08-26T00:00:00.000Z',
          retryAfter: 120,
          refresh: 30,
        },
      },
    })
    const maintenance = useNuxtMaintenanceError(error)

    expect(maintenance.state.value?.down).toBe(true)
    expect(maintenance.message.value).toBe('Deploying')
    expect(maintenance.since.value).toBe('2026-08-26T00:00:00.000Z')
    expect(maintenance.retryAfter.value).toBe(120)
    expect(maintenance.refresh.value).toBe(30)

    error.value = { data: { code: 'NUXT_MAINTAINER', maintenance: { down: true, message: 'Updated' } } }
    expect(maintenance.message.value).toBe('Updated')

    error.value = { data: { code: 'NUXT_MAINTAINER', maintenance: { down: 'yes' } } }
    expect(maintenance.state.value).toBeNull()
    expect(fetch).not.toHaveBeenCalled()
    fetch.mockRestore()
  })
})
