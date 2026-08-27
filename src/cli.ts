import { randomBytes } from 'node:crypto'
import { loadNuxtConfig } from '@nuxt/kit'
import { defineCommand, runMain } from 'citty'
import { consola } from 'consola'
import { defu } from 'defu'
import { resolve } from 'pathe'
import { createStorage, type Storage } from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
import { readSection, readSections, readSite } from './runtime/core/storage'
import { hashSecret } from './runtime/core/secret'
import { assertSectionName, DEFAULT_KEY_PREFIX, DEFAULT_MESSAGE, DEFAULT_MOUNT, DEFAULT_SECTION_MESSAGE, parsePositiveInteger, publicState, sectionKey, siteKey } from './runtime/core/state'
import type { MaintenanceRecord, ModuleOptions, PublicMaintenanceState } from './types'

const cwdArg = { cwd: { type: 'string', description: 'Nuxt project directory', default: '.' } } as const
const jsonArg = { json: { type: 'boolean', description: 'Print stable JSON output', default: false } } as const

const command = defineCommand({
  meta: { name: 'nuxt-maintainer', version: '1.0.0', description: 'Manage maintenance state for a Nuxt application.' },
  args: cwdArg,
  subCommands: {
    down: defineCommand({
      meta: { name: 'down', description: 'Put the application into maintenance mode.' },
      args: {
        ...cwdArg,
        'message': { type: 'string', description: 'Maintenance message.' },
        'retry': { type: 'string', description: 'Retry-After value in seconds.' },
        'refresh': { type: 'string', description: 'Refresh value in seconds.' },
        'secret': { type: 'string', description: 'Secret URL token.' },
        'with-secret': { type: 'boolean', description: 'Generate a secret token.', default: false },
      },
      async run({ args }) {
        if (args.secret && args['with-secret']) throw new Error('--secret and --with-secret cannot be used together.')
        const token = args.secret || (args['with-secret'] ? randomBytes(24).toString('base64url') : undefined)
        const retryAfter = parsePositiveInteger(args.retry, '--retry')
        const refresh = parsePositiveInteger(args.refresh, '--refresh')
        await withProject(args.cwd, ({ storage, prefix, options }) => {
          const record: MaintenanceRecord = {
            version: 1,
            message: args.message || options.defaultMessage || DEFAULT_MESSAGE,
            since: new Date().toISOString(),
            ...(retryAfter ? { retryAfter } : {}),
            ...(refresh ? { refresh } : {}),
            ...(token ? { secretHash: hashSecret(token) } : {}),
          }
          return storage.setItem(siteKey(prefix), record)
        })
        consola.success('Application is now down.')
        if (token) consola.info(`Secret bypass URL: /${encodeURIComponent(token)}`)
      },
    }),
    up: defineCommand({
      meta: { name: 'up', description: 'Bring the application out of maintenance mode.' },
      args: cwdArg,
      async run({ args }) {
        await withProject(args.cwd, ({ storage, prefix }) => storage.removeItem(siteKey(prefix)))
        consola.success('Application is now live.')
      },
    }),
    status: defineCommand({
      meta: { name: 'status', description: 'Read application maintenance state.' },
      args: { ...cwdArg, ...jsonArg },
      async run({ args }) {
        const state = await withProject(args.cwd, ({ storage, prefix }) => readSite(storage, prefix).then(publicState))
        printStatus('site', state, args.json)
      },
    }),
    section: defineCommand({
      meta: { name: 'section', description: 'Manage named maintenance sections.' },
      subCommands: {
        down: defineCommand({
          meta: { name: 'down', description: 'Put a named section into maintenance mode.' },
          args: {
            ...cwdArg,
            name: { type: 'positional', description: 'Section name', required: true },
            message: { type: 'string', description: 'Section maintenance message.' },
          },
          async run({ args }) {
            assertSectionName(args.name)
            await withProject(args.cwd, ({ storage, prefix, options }) => {
              const record: MaintenanceRecord = {
                version: 1,
                message: args.message || options.sectionDefaultMessage || DEFAULT_SECTION_MESSAGE,
                since: new Date().toISOString(),
              }
              return storage.setItem(sectionKey(args.name, prefix), record)
            })
            consola.success(`Section ${args.name} is now down.`)
          },
        }),
        up: defineCommand({
          meta: { name: 'up', description: 'Bring a named section out of maintenance mode.' },
          args: { ...cwdArg, name: { type: 'positional', description: 'Section name', required: true } },
          async run({ args }) {
            assertSectionName(args.name)
            await withProject(args.cwd, ({ storage, prefix }) => storage.removeItem(sectionKey(args.name, prefix)))
            consola.success(`Section ${args.name} is now live.`)
          },
        }),
        status: defineCommand({
          meta: { name: 'status', description: 'Read one or all section states.' },
          args: {
            ...cwdArg,
            ...jsonArg,
            name: { type: 'positional', description: 'Optional section name', required: false },
          },
          async run({ args }) {
            if (args.name) {
              assertSectionName(args.name)
              const state = await withProject(args.cwd, ({ storage, prefix }) => readSection(storage, prefix, args.name!).then(publicState))
              printStatus(`section:${args.name}`, state, args.json)
              return
            }
            const records = await withProject(args.cwd, ({ storage, prefix }) => readSections(storage, prefix))
            const states = Object.fromEntries(Object.keys(records).sort().map(name => [name, publicState(records[name])]))
            if (args.json) console.log(JSON.stringify({ scope: 'sections', sections: states }))
            else if (Object.keys(states).length === 0) consola.info('No sections are down.')
            else Object.entries(states).forEach(([name, state]) => printStatus(`section:${name}`, state, false))
          },
        }),
      },
    }),
  },
})

interface ProjectStorage { storage: Storage, prefix: string, options: ModuleOptions }

async function withProject<T>(cwd: string, callback: (project: ProjectStorage) => Promise<T>): Promise<T> {
  const project = await openProjectStorage(resolve(cwd))
  try {
    return await callback(project)
  } finally {
    await project.storage.dispose()
  }
}

async function openProjectStorage(cwd: string): Promise<ProjectStorage> {
  const config = await loadNuxtConfig({ cwd })
  if (!config?._layers?.[0]?.configFile) throw new Error(`${cwd} is not a Nuxt project.`)
  const options = readModuleOptions(config)
  const mount = options.storage?.mount || DEFAULT_MOUNT
  const prefix = options.storage?.keyPrefix || DEFAULT_KEY_PREFIX
  const mounts = config.nitro?.storage as Record<string, Record<string, unknown>> | undefined
  const driverOptions = mounts?.[mount]

  if (!driverOptions && mount !== DEFAULT_MOUNT) throw new Error(`Nitro storage mount "${mount}" is not configured.`)
  if (!driverOptions) {
    return { storage: createStorage({ driver: fsDriver({ base: resolve(cwd, '.data/nuxt-maintainer') }) }), prefix, options }
  }
  if (driverOptions.driver === 'fs') {
    const base = typeof driverOptions.base === 'string' ? resolve(cwd, driverOptions.base) : resolve(cwd, '.data/nuxt-maintainer')
    return { storage: createStorage({ driver: fsDriver({ ...driverOptions, base }) }), prefix, options }
  }
  if (driverOptions.driver === 'redis') {
    let redisDriver: typeof import('unstorage/drivers/redis').default
    try {
      redisDriver = (await import('unstorage/drivers/redis')).default
    } catch {
      throw new Error('Redis storage requires the optional ioredis@^5 peer dependency.')
    }
    return { storage: createStorage({ driver: redisDriver(driverOptions) }), prefix, options }
  }
  throw new Error(`Unsupported Nitro storage driver "${String(driverOptions.driver)}". nuxt-maintainer 1.0 supports fs and redis.`)
}

function readModuleOptions(config: Record<string, any>): ModuleOptions {
  const topLevel = (config.maintainer || {}) as ModuleOptions
  const modules = Array.isArray(config.modules) ? config.modules : []
  const tuple = modules.find(entry => Array.isArray(entry) && String(entry[0]).includes('nuxt-maintainer')) as [unknown, ModuleOptions] | undefined
  return defu(topLevel, tuple?.[1] || {})
}

function printStatus(scope: string, state: PublicMaintenanceState, json: boolean) {
  if (json) console.log(JSON.stringify({ scope, status: state.down ? 'down' : 'up', ...state }))
  else if (!state.down) consola.success(`${scope} is up.`)
  else consola.warn(`${scope} is down: ${state.message}`)
}

export function main() {
  return runMain(command)
}
