import { defineEventHandler, getQuery } from 'h3'
import { assertSectionName, publicState } from '../core/state'
import { readSection, readSite } from '../core/storage'
import { getMaintainerConfig, getMaintenanceStorage, hasValidBypassCookie, warnStorageFailure } from './utils'

export default defineEventHandler(async (event) => {
  const config = getMaintainerConfig(event)
  const section = getQuery(event).section
  try {
    const storage = getMaintenanceStorage(config)
    const site = await readSite(storage, config.keyPrefix)
    if (typeof section === 'string') {
      assertSectionName(section)
      const sectionRecord = await readSection(storage, config.keyPrefix, section)
      return { site: publicState(site), sections: { [section]: publicState(sectionRecord) }, bypassed: Boolean(site && hasValidBypassCookie(event, site)) }
    }
    return { site: publicState(site), bypassed: Boolean(site && hasValidBypassCookie(event, site)) }
  } catch (error) {
    warnStorageFailure(error)
    return { site: { down: false } }
  }
})
