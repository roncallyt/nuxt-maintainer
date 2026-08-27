import type { MaintenanceRecord } from '../../types'
import { isMaintenanceRecord, sectionKey, sectionsBase, siteKey } from './state'

export interface MaintenanceStorage {
  getItem<T>(key: string): Promise<T | null>
  setItem<T>(key: string, value: T): Promise<void>
  removeItem(key: string): Promise<void>
  getKeys(base?: string): Promise<string[]>
}

export const readSite = (storage: MaintenanceStorage, prefix: string) => readRecord(storage, siteKey(prefix))
export const readSection = (storage: MaintenanceStorage, prefix: string, name: string) => readRecord(storage, sectionKey(name, prefix))

export async function readSections(storage: MaintenanceStorage, prefix: string): Promise<Record<string, MaintenanceRecord>> {
  const base = sectionsBase(prefix)
  const keys = await storage.getKeys(base)
  const entries = await Promise.all(keys.map(async (key) => {
    const record = await readRecord(storage, key)
    return record ? [key.slice(base.length), record] as const : null
  }))
  return Object.fromEntries(entries.filter(entry => entry !== null))
}

async function readRecord(storage: MaintenanceStorage, key: string): Promise<MaintenanceRecord | null> {
  const value = await storage.getItem<unknown>(key)
  if (value === null || value === undefined) return null
  if (!isMaintenanceRecord(value)) throw new Error(`Invalid maintenance record at ${key}.`)
  return value
}
