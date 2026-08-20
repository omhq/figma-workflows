type PropertyPath = string | readonly (string | number)[]

const toPath = (path: PropertyPath) =>
  Array.isArray(path)
    ? [...path]
    : String(path)
        .replace(/\[(\w+)\]/g, '.$1')
        .split('.')
        .filter(Boolean)

export function getPath<T = any>(
  source: unknown,
  path: PropertyPath,
  fallback?: T
): T {
  const value = toPath(path).reduce<unknown>((current, key) => {
    if (current === null || current === undefined) return undefined
    return (current as Record<string | number, unknown>)[key]
  }, source)

  return (value === undefined ? fallback : value) as T
}

export function setPath<T extends object>(
  source: T,
  path: PropertyPath,
  value: unknown
): T {
  const keys = toPath(path)
  let current = source as Record<string | number, unknown>

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value
      return
    }

    const nextKey = keys[index + 1]
    const existing = current[key]
    if (!existing || typeof existing !== 'object') {
      current[key] = typeof nextKey === 'number' ? [] : {}
    }
    current = current[key] as Record<string | number, unknown>
  })

  return source
}

export function omitKey<T extends Record<string, unknown>>(
  source: T,
  keyToOmit: string
) {
  return Object.fromEntries(
    Object.entries(source).filter(([key]) => key !== keyToOmit)
  ) as Record<string, unknown>
}

export const isNil = (value: unknown): value is null | undefined =>
  value === null || value === undefined
