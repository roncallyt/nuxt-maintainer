import { createHash, timingSafeEqual } from 'node:crypto'

export function hashSecret(secret: string) {
  return createHash('sha256').update(secret).digest('hex')
}

export function bypassCookieValue(secretHash: string) {
  return createHash('sha256').update(`nuxt-maintainer-cookie:${secretHash}`).digest('base64url')
}

export function constantEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}
