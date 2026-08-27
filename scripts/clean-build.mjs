import { lstatSync, readlinkSync, unlinkSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'pathe'

const rootDir = fileURLToPath(new URL('..', import.meta.url))
const runtimeOutput = resolve(rootDir, 'dist/runtime')
const runtimeSource = resolve(rootDir, 'src/runtime')

try {
  if (lstatSync(runtimeOutput).isSymbolicLink()) {
    const target = resolve(rootDir, readlinkSync(runtimeOutput))
    if (target !== runtimeSource) throw new Error(`Refusing to remove unexpected runtime link: ${target}`)
    unlinkSync(runtimeOutput)
  }
} catch (error) {
  if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error
}
