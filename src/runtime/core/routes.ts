export function matchesRoutePattern(path: string, pattern: string) {
  if (!pattern) return false
  const globstar = '\u0000'
  const escaped = pattern
    .replace(/\*\*/g, globstar)
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '[^/]*')
    .replaceAll(globstar, '.*')
  return new RegExp(`^${escaped}$`).test(path)
}
