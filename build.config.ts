import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  failOnWarn: false,
  rollup: {
    emitCJS: false,
  },
  entries: ['src/cli'],
})
