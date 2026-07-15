#!/usr/bin/env node
import { build, type BuildOptions, normalizeFormat } from './index'

interface ParsedArgs extends BuildOptions {
  help?: boolean
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2))

  if (options.help) {
    printHelp()
    return
  }

  await build(options)
}

export function parseArgs(args: string[]): ParsedArgs {
  const options: ParsedArgs = {}
  const positional: string[] = []

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--help' || arg === '-h') {
      options.help = true
      continue
    }

    if (arg === '--format' || arg === '-f') {
      options.formats = readValue(args, ++index, arg)
        .split(',')
        .map(normalizeFormat)
      continue
    }

    if (arg.startsWith('--format=')) {
      options.formats = arg.slice('--format='.length).split(',').map(normalizeFormat)
      continue
    }

    if (arg === '--out-dir') {
      options.outDir = readValue(args, ++index, arg)
      continue
    }

    if (arg.startsWith('--out-dir=')) {
      options.outDir = arg.slice('--out-dir='.length)
      continue
    }

    if (arg === '--name') {
      options.name = readValue(args, ++index, arg)
      continue
    }

    if (arg.startsWith('--name=')) {
      options.name = arg.slice('--name='.length)
      continue
    }

    if (arg === '--external') {
      options.external = splitList(readValue(args, ++index, arg))
      continue
    }

    if (arg.startsWith('--external=')) {
      options.external = splitList(arg.slice('--external='.length))
      continue
    }

    if (arg === '--tsconfig') {
      options.tsconfig = readValue(args, ++index, arg)
      continue
    }

    if (arg.startsWith('--tsconfig=')) {
      options.tsconfig = arg.slice('--tsconfig='.length)
      continue
    }

    if (arg === '--target') {
      options.target = readValue(args, ++index, arg)
      continue
    }

    if (arg.startsWith('--target=')) {
      options.target = arg.slice('--target='.length)
      continue
    }

    if (arg === '--no-clean') {
      options.clean = false
      continue
    }

    if (arg === '--sourcemap') {
      options.sourcemap = true
      continue
    }

    if (arg === '--no-sourcemap') {
      options.sourcemap = false
      continue
    }

    if (arg === '--compress' || arg === '--minify') {
      options.minify = true
      continue
    }

    if (arg === '--no-compress' || arg === '--no-minify') {
      options.minify = false
      continue
    }

    if (arg.startsWith('-')) {
      throw new Error(`Unknown option "${arg}".`)
    }

    positional.push(arg)
  }

  if (positional.length > 1) {
    throw new Error(`Expected one entry file, received ${positional.length}.`)
  }

  options.entry = positional[0]
  return options
}

function readValue(args: string[], index: number, flag: string): string {
  const value = args[index]

  if (!value || value.startsWith('-')) {
    throw new Error(`Expected a value after ${flag}.`)
  }

  return value
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function printHelp(): void {
  console.log(`Usage: microbundle [entry] [options]

Options:
  -f, --format <list>    Output formats: es,cjs,umd
  --out-dir <dir>        Output directory, defaults to dist
  --name <global>        Global name for UMD output
  --external <list>      Extra external dependencies
  --tsconfig <file>      TypeScript config, defaults to tsconfig.json
  --target <target>      Transpile target hint: node or web
  --no-clean             Keep existing dist/types directories
  --no-minify            Skip .min outputs
  --no-sourcemap         Skip sourcemaps
`)
}

if (require.main === module) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error(message)
    process.exitCode = 1
  })
}
