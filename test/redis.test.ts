import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createStorage } from 'unstorage'
import redisDriver from 'unstorage/drivers/redis'
import type { MaintenanceRecord } from '../src/types'
import { readSite } from '../src/runtime/core/storage'
import { siteKey } from '../src/runtime/core/state'

const redisUrl = process.env.REDIS_URL
const base = `nuxt-maintainer-test-${process.pid}-${Date.now()}`
const first = redisUrl ? createStorage({ driver: redisDriver({ url: redisUrl, base }) }) : null
const second = redisUrl ? createStorage({ driver: redisDriver({ url: redisUrl, base }) }) : null

describe.skipIf(!redisUrl)('shared Redis storage', () => {
  beforeAll(async () => {
    await first!.clear()
  })

  afterAll(async () => {
    await first!.clear()
    await first!.dispose()
    await second!.dispose()
  })

  it('shares live state between independent clients and isolates prefixes', async () => {
    const record: MaintenanceRecord = {
      version: 1,
      message: 'Distributed maintenance',
      since: '2026-08-26T00:00:00.000Z',
    }
    await first!.setItem(siteKey('app-one'), record)
    expect(await readSite(second!, 'app-one')).toEqual(record)
    expect(await readSite(second!, 'app-two')).toBeNull()
    await second!.removeItem(siteKey('app-one'))
    expect(await readSite(first!, 'app-one')).toBeNull()
  })
})
