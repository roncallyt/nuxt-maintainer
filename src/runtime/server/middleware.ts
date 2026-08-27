import { defineEventHandler, getHeader, getRequestURL, sendRedirect, setCookie, setHeader, setResponseStatus } from 'h3'
import { BYPASS_COOKIE, publicState } from '../core/state'
import { bypassCookieValue, constantEqual, hashSecret } from '../core/secret'
import { readSite } from '../core/storage'
import { applyMaintenanceHeaders, getMaintainerConfig, getMaintenanceStorage, hasValidBypassCookie, isExcludedPath, isJsonRequest, warnStorageFailure } from './utils'

export default defineEventHandler(async (event) => {
  const config = getMaintainerConfig(event)
  const url = getRequestURL(event)
  const path = url.pathname
  if (isExcludedPath(path, config.exclude)) return

  try {
    const record = await readSite(getMaintenanceStorage(config), config.keyPrefix)
    if (!record) {
      event.context.nuxtMaintainer = { site: { down: false }, bypassed: false }
      return
    }

    const presentedSecret = decodeSecretPath(path)
    if (presentedSecret && record.secretHash && constantEqual(hashSecret(presentedSecret), record.secretHash)) {
      setCookie(event, BYPASS_COOKIE, bypassCookieValue(record.secretHash), {
        httpOnly: true,
        sameSite: 'lax',
        secure: url.protocol === 'https:' || getHeader(event, 'x-forwarded-proto') === 'https',
        path: '/',
      })
      return sendRedirect(event, '/', 302)
    }

    const bypassed = hasValidBypassCookie(event, record)
    event.context.nuxtMaintainer = { site: publicState(record), record, bypassed }
    if (bypassed) return

    applyMaintenanceHeaders(event, record)
    if (isJsonRequest(event, path)) {
      setResponseStatus(event, 503, 'Service Unavailable')
      setHeader(event, 'Content-Type', 'application/json; charset=utf-8')
      return {
        statusCode: 503,
        statusMessage: 'Service Unavailable',
        message: record.message,
        data: { code: 'NUXT_MAINTAINER', maintenance: publicState(record) },
      }
    }
  } catch (error) {
    event.context.nuxtMaintainer = { site: { down: false }, bypassed: false }
    warnStorageFailure(error)
  }
})

function decodeSecretPath(path: string) {
  const parts = path.split('/').filter(Boolean)
  if (parts.length !== 1) return null
  try {
    return decodeURIComponent(parts[0]!)
  } catch {
    return null
  }
}
