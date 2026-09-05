import { fileURLToPath } from 'node:url'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { $fetch, fetch, setup } from '@nuxt/test-utils/e2e'
import { createStorage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
import type { MaintenanceRecord } from '../src/types'
import { hashSecret } from '../src/runtime/core/secret'
import { sectionKey, siteKey } from '../src/runtime/core/state'

const fixtureDir = fileURLToPath(new URL('./fixtures/basic', import.meta.url))
const storage = createStorage({ driver: fsDriver({ base: `${fixtureDir}/.data/nuxt-maintainer` }) })

describe.sequential('running application', async () => {
  await setup({ rootDir: fixtureDir })

  beforeEach(async () => {
    await storage.removeItem(siteKey())
    await storage.removeItem(sectionKey('checkout'))
    await storage.removeItem(sectionKey('unknown'))
    await storage.removeItem(sectionKey('inventory'))
  })

  afterAll(async () => {
    await storage.removeItem(siteKey())
    await storage.removeItem(sectionKey('checkout'))
    await storage.removeItem(sectionKey('inventory'))
    await storage.dispose()
  })

  it('serves the application while up', async () => {
    expect(await $fetch('/')).toContain('<div>basic</div>')
  })

  it('returns an URL-preserving HTML 503 through the existing error page', async () => {
    await putSite({ message: 'Deploying safely', retryAfter: 120, refresh: 30 })
    const response = await fetch('/requested/url', { headers: { accept: 'text/html' } })
    const html = await response.text()
    expect(response.status).toBe(503)
    expect(response.url).toMatch(/\/requested\/url$/)
    expect(response.headers.get('retry-after')).toBe('120')
    expect(response.headers.get('refresh')).toBe('30')
    expect(html).toContain('Deploying safely')
    expect(html).not.toContain('Existing error page')
  })

  it('composes maintenance error fields with custom and default child renderers', async () => {
    await putSite({ message: 'Compound maintenance', retryAfter: 120, refresh: 30 })
    const response = await fetch('/compound', { headers: { accept: 'text/html' } })
    const html = await response.text()

    expect(response.status).toBe(503)
    expect(html).toContain('id="compound-error"')
    expect(html).toContain('<h2>Custom maintenance title</h2>')
    expect(html).toContain('id="custom-message"')
    expect(html).toContain('Compound maintenance')
    expect(html).toContain('This page will refresh in 30 seconds.')
    expect(html).toContain('Maintenance began <time datetime="2026-08-26T00:00:00.000Z">')
    expect(html).toContain('id="custom-retry" value="120"')
    expect(html).not.toContain('<h1>Temporarily unavailable</h1>')
  })

  it('returns a tagged structured JSON 503 for APIs', async () => {
    await putSite({ message: 'API maintenance' })
    const response = await fetch('/api/ping', { headers: { accept: 'application/json' } })
    expect(response.status).toBe(503)
    expect(await response.json()).toMatchObject({
      statusCode: 503,
      message: 'API maintenance',
      data: { code: 'NUXT_MAINTAINER', maintenance: { down: true } },
    })
  })

  it('keeps configured health checks and internal status available', async () => {
    await putSite({ message: 'Maintenance' })
    expect(await $fetch('/health')).toBe('healthy')
    expect(await $fetch('/_nuxt-maintainer/status')).toMatchObject({ site: { down: true, message: 'Maintenance' } })
  })

  it('sets an opaque bypass cookie and invalidates it with new state', async () => {
    await putSite({ message: 'Private maintenance', secretHash: hashSecret('demo-secret') })
    const bypass = await fetch('/demo-secret', { redirect: 'manual' })
    expect(bypass.status).toBe(302)
    expect(bypass.headers.get('location')).toBe('/')
    const setCookie = bypass.headers.get('set-cookie') || ''
    expect(setCookie).toContain('nuxt-maintainer-bypass=')
    expect(setCookie).toContain('HttpOnly')
    expect(setCookie).toContain('SameSite=Lax')
    expect(setCookie).toContain('Path=/')
    expect(setCookie).not.toContain(hashSecret('demo-secret'))
    const cookie = setCookie.split(';')[0]!
    expect((await fetch('/', { headers: { cookie } })).status).toBe(200)
    expect(await (await fetch('/_nuxt-maintainer/status', { headers: { cookie } })).json()).toMatchObject({
      site: { down: true },
      bypassed: true,
    })

    await storage.removeItem(siteKey())
    await putSite({ message: 'New window', secretHash: hashSecret('new-secret') })
    expect((await fetch('/', { headers: { cookie, accept: 'text/html' } })).status).toBe(503)
  })

  it('renders section fallbacks during SSR without affecting unknown sections', async () => {
    await storage.setItem(sectionKey('checkout'), record({ message: 'Checkout paused' }))
    const html = await $fetch('/sections')
    expect(html).toContain('id="checkout-down"')
    expect(html).toContain('Checkout paused')
    expect(html).toContain('id="unknown-up"')
    expect(html).not.toContain('id="checkout-up"')
  })

  it('supports nested section boundaries', async () => {
    await storage.setItem(sectionKey('inventory'), record({ message: 'Inventory paused' }))
    const html = await $fetch('/sections')
    expect(html).toContain('id="checkout-up"')
    expect(html).toContain('id="inventory-down"')
    expect(html).toContain('Inventory paused')
    expect(html).not.toContain('id="inventory-up"')
  })

  it('fails open when a runtime record is corrupt', async () => {
    await storage.setItem(siteKey(), { version: 99 })
    expect(await $fetch('/')).toContain('<div>basic</div>')
  })
})

async function putSite(input: Partial<MaintenanceRecord>) {
  await storage.setItem(siteKey(), record(input))
}

function record(input: Partial<MaintenanceRecord>): MaintenanceRecord {
  return {
    version: 1,
    message: 'Maintenance',
    since: '2026-08-26T00:00:00.000Z',
    ...input,
  }
}
