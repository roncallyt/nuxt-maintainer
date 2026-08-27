import { fileURLToPath } from 'node:url'
import { addComponent, addImports, addRouteMiddleware, addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'
import { defu } from 'defu'
import type { ModuleOptions } from './types'
import { DEFAULT_KEY_PREFIX, DEFAULT_MESSAGE, DEFAULT_MOUNT, DEFAULT_SECTION_MESSAGE } from './runtime/core/state'

export type { MaintenanceRecord, MaintenanceStatus, ModuleOptions, PublicMaintenanceState, StorageOptions } from './types'
export { isMaintenanceError } from './runtime/core/error'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-maintainer',
    configKey: 'maintainer',
    compatibility: { nuxt: '^3.21.0 || ^4.0.0' },
  },
  defaults: {
    storage: { mount: DEFAULT_MOUNT, keyPrefix: DEFAULT_KEY_PREFIX },
    exclude: [],
    defaultMessage: DEFAULT_MESSAGE,
    sectionDefaultMessage: DEFAULT_SECTION_MESSAGE,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    const mount = options.storage?.mount || DEFAULT_MOUNT
    const keyPrefix = options.storage?.keyPrefix || DEFAULT_KEY_PREFIX

    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.nitro.storage ||= {}
    if (!nuxt.options.nitro.storage[mount]) {
      nuxt.options.nitro.storage[mount] = {
        driver: 'fs',
        base: resolver.resolve(nuxt.options.rootDir, '.data/nuxt-maintainer'),
      }
    }
    nuxt.options.runtimeConfig.maintainer = defu(
      nuxt.options.runtimeConfig.maintainer as Record<string, unknown> | undefined,
      {
        mount,
        keyPrefix,
        exclude: options.exclude || [],
        defaultMessage: options.defaultMessage || DEFAULT_MESSAGE,
        sectionDefaultMessage: options.sectionDefaultMessage || DEFAULT_SECTION_MESSAGE,
      },
    )

    addServerHandler({ middleware: true, handler: resolver.resolve('./runtime/server/middleware') })
    addServerHandler({ route: '/_nuxt-maintainer/status', handler: resolver.resolve('./runtime/server/status.get') })
    addRouteMiddleware({ name: 'nuxt-maintainer', path: resolver.resolve('./runtime/middleware/maintenance'), global: true }, { prepend: true })
    addImports([
      { name: 'useNuxtMaintenance', from: resolver.resolve('./runtime/composables/useNuxtMaintenance') },
      { name: 'isMaintenanceError', from: resolver.resolve('./runtime/utils/error') },
    ])
    addComponent({ name: 'NuxtMaintenance', filePath: resolver.resolve('./runtime/components/NuxtMaintenance.vue') })
    addComponent({ name: 'NuxtMaintenanceError', filePath: resolver.resolve('./runtime/components/NuxtMaintenanceError.vue') })
  },
})
