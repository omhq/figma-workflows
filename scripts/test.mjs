import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import process from 'node:process'

const findTests = directory =>
  readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    return entry.isDirectory()
      ? findTests(path)
      : entry.name.endsWith('.test.ts')
        ? [path]
        : []
  })

const result = spawnSync(
  process.execPath,
  ['--import', 'tsx', '--test', ...findTests('src')],
  { stdio: 'inherit' }
)

if (result.error) throw result.error
process.exit(result.status ?? 1)
