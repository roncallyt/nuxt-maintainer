import { defineEventHandler } from 'h3'

export default defineEventHandler(() => ({ pong: true, at: new Date().toISOString() }))
