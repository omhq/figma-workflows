/** Numeric fields accept arithmetic without executing JavaScript. */
export function normalizeNumberArgument(
  value: unknown
): number | string | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'number' && Number.isFinite(value)) return value

  const invalid = () =>
    new Error('Enter a number or arithmetic such as 60/100.')
  if (typeof value !== 'string') throw invalid()

  // Explicit workflow expressions are resolved later with the layer and env.
  if (value.includes('{{')) return value

  const source = value.trim()
  if (!source) return null
  let position = 0

  const skipSpaces = () => {
    while (/\s/.test(source[position] || '') && position < source.length)
      position++
  }

  const primary = (): number => {
    skipSpaces()
    const token = source[position]
    if (token === '+' || token === '-') {
      position++
      const result = primary()
      return token === '-' ? -result : result
    }
    if (token === '(') {
      position++
      const result = sum()
      skipSpaces()
      if (source[position++] !== ')') throw invalid()
      return result
    }

    const literal = /^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/i.exec(
      source.slice(position)
    )
    if (!literal) throw invalid()
    position += literal[0].length
    return Number(literal[0])
  }

  const product = (): number => {
    let result = primary()
    skipSpaces()
    while (source[position] === '*' || source[position] === '/') {
      const operator = source[position++]
      const right = primary()
      result = operator === '*' ? result * right : result / right
      skipSpaces()
    }
    return result
  }

  const sum = (): number => {
    let result = product()
    skipSpaces()
    while (source[position] === '+' || source[position] === '-') {
      const operator = source[position++]
      const right = product()
      result = operator === '+' ? result + right : result - right
      skipSpaces()
    }
    return result
  }

  const result = sum()
  if (position !== source.length) throw invalid()
  if (!Number.isFinite(result)) {
    throw new Error(
      'The numeric result must be finite. Check for division by zero.'
    )
  }
  return result
}
