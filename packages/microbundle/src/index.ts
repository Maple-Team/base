import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import { builtinModules, createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import type {
  OutputOptions,
  Plugin,
  RollupBuild,
  RollupOptions,
  SourceMapInput,
} from 'rollup'
import { rollup } from 'rollup'

export type BundleFormat = 'es' | 'cjs' | 'iife'

export interface BuildOptions {
  cwd?: string
  entry?: string
  formats?: BundleFormat[]
  outDir?: string
  name?: string
  external?: string[]
  tsconfig?: string
  clean?: boolean
  sourcemap?: boolean
  minify?: boolean
  target?: string
}

export interface BuildResult {
  files: string[]
}

interface PackageJson {
  name?: string
  source?: string
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
}

interface LoadedTypescript {
  module: typeof import('typescript')
  path: string
}

interface BuildContext {
  cwd: string
  pkg: PackageJson
  entry: string
  outDir: string
  tsconfig: string
  formats: BundleFormat[]
  name: string
  external: string[]
  clean: boolean
  sourcemap: boolean
  minify: boolean
  target?: string
}

const DEFAULT_FORMATS: BundleFormat[] = ['es', 'cjs', 'iife']
const EXTENSIONS = ['.mjs', '.js', '.json', '.node', '.ts', '.tsx']
const requireFromHere = createRequire(__filename)
const builtins = new Set([
  ...builtinModules,
  ...builtinModules.map((mod) => `node:${mod}`),
])

export async function build(options: BuildOptions = {}): Promise<BuildResult> {
  const ctx = createBuildContext(options)

  if (ctx.clean) {
    fs.rmSync(ctx.outDir, { recursive: true, force: true })
    fs.rmSync(path.join(ctx.cwd, 'types'), { recursive: true, force: true })
  }

  fs.mkdirSync(ctx.outDir, { recursive: true })

  const ts = loadTypescript(ctx.cwd)
  const bundle = await createBundle(ctx, ts)

  try {
    const files = await writeOutputs(bundle, ctx)
    emitDeclarations(ctx, ts)
    return { files }
  } finally {
    await bundle.close()
  }
}

export function normalizeFormat(format: string): BundleFormat {
  const normalized = format.trim().toLowerCase()

  if (normalized === 'esm' || normalized === 'module') {
    return 'es'
  }

  if (normalized === 'commonjs' || normalized === 'require') {
    return 'cjs'
  }

  if (normalized === 'iifi' || normalized === 'browser') {
    return 'iife'
  }

  if (normalized === 'es' || normalized === 'cjs' || normalized === 'iife') {
    return normalized
  }

  throw new Error(`Unsupported format "${format}". Expected es, cjs, or iife.`)
}

function createBuildContext(options: BuildOptions): BuildContext {
  const cwd = path.resolve(options.cwd ?? process.cwd())
  const pkg = readPackageJson(cwd)
  const tsconfig = path.resolve(cwd, options.tsconfig ?? 'tsconfig.json')
  const entry = path.resolve(cwd, options.entry ?? findEntry(cwd, pkg))
  const outDir = path.resolve(cwd, options.outDir ?? 'dist')

  return {
    cwd,
    pkg,
    entry,
    outDir,
    tsconfig,
    formats: options.formats?.length ? options.formats : DEFAULT_FORMATS,
    name: options.name ?? packageNameToGlobal(pkg.name ?? path.basename(cwd)),
    external: options.external ?? [],
    clean: options.clean ?? true,
    sourcemap: options.sourcemap ?? true,
    minify: options.minify ?? true,
    target: options.target,
  }
}

function readPackageJson(cwd: string): PackageJson {
  const pkgPath = path.join(cwd, 'package.json')

  if (!fs.existsSync(pkgPath)) {
    return {}
  }

  return JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as PackageJson
}

function findEntry(cwd: string, pkg: PackageJson): string {
  const candidates = [
    pkg.source,
    'src/index.ts',
    'src/index.tsx',
    'src/index.js',
    'index.ts',
    'index.js',
  ].filter(Boolean) as string[]

  const found = candidates.find((candidate) => {
    return fs.existsSync(path.resolve(cwd, candidate))
  })

  if (!found) {
    throw new Error('Could not find an entry file. Pass one explicitly or set package.json "source".')
  }

  return found
}

function packageNameToGlobal(name: string): string {
  const cleaned = name
    .replace(/^@/, '')
    .replace(/[^\w]+(.)?/g, (_, char: string | undefined) => (char ? char.toUpperCase() : ''))

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

function loadTypescript(cwd: string): LoadedTypescript {
  const projectRequire = createRequire(path.join(cwd, 'package.json'))

  try {
    const tsPath = projectRequire.resolve('typescript')
    return {
      module: projectRequire(tsPath) as typeof import('typescript'),
      path: tsPath,
    }
  } catch {
    const tsPath = requireFromHere.resolve('typescript')
    return {
      module: requireFromHere(tsPath) as typeof import('typescript'),
      path: tsPath,
    }
  }
}

async function createBundle(ctx: BuildContext, ts: LoadedTypescript): Promise<RollupBuild> {
  const options: RollupOptions = {
    input: ctx.entry,
    external: createExternalMatcher(ctx),
    treeshake: true,
    plugins: [
      typescriptTranspilePlugin(ctx, ts),
      nodeResolve({
        extensions: EXTENSIONS,
        preferBuiltins: true,
      }),
      commonjs(),
      json(),
    ],
  }

  return rollup(options)
}

function createExternalMatcher(ctx: BuildContext) {
  const packageExternal = [
    ...Object.keys(ctx.pkg.dependencies ?? {}),
    ...Object.keys(ctx.pkg.peerDependencies ?? {}),
    ...Object.keys(ctx.pkg.optionalDependencies ?? {}),
    ...ctx.external,
  ]
  const external = new Set(packageExternal)

  return (id: string) => {
    if (id.startsWith('.') || path.isAbsolute(id) || id.startsWith('\0')) {
      return false
    }

    if (builtins.has(id)) {
      return true
    }

    return [...external].some((dependency) => {
      return id === dependency || id.startsWith(`${dependency}/`)
    })
  }
}

function typescriptTranspilePlugin(ctx: BuildContext, loadedTs: LoadedTypescript): Plugin {
  const ts = loadedTs.module
  const parsed = readTsconfig(ctx.tsconfig, loadedTs)

  return {
    name: 'liutsing-typescript-transpile',
    transform(code, id) {
      if (!/\.[cm]?tsx?$/.test(id) || id.includes('node_modules')) {
        return null
      }

      const result = ts.transpileModule(code, {
        fileName: id,
        reportDiagnostics: true,
        compilerOptions: {
          ...parsed.options,
          declaration: false,
          declarationMap: false,
          emitDeclarationOnly: false,
          module: ts.ModuleKind.ESNext,
          sourceMap: ctx.sourcemap,
          target: targetToScriptTarget(ctx.target, ts) ?? parsed.options.target,
        },
      })

      const diagnostics = result.diagnostics?.filter((diagnostic) => {
        return diagnostic.category === ts.DiagnosticCategory.Error
      })

      if (diagnostics?.length) {
        throw new Error(formatDiagnostics(diagnostics, loadedTs, ctx.cwd))
      }

      return {
        code: result.outputText,
        map: result.sourceMapText ? (JSON.parse(result.sourceMapText) as SourceMapInput) : null,
      }
    },
  }
}

function readTsconfig(tsconfigPath: string, loadedTs: LoadedTypescript) {
  const ts = loadedTs.module

  if (!fs.existsSync(tsconfigPath)) {
    return {
      fileNames: [tsconfigPath],
      options: {},
      errors: [],
    } as import('typescript').ParsedCommandLine
  }

  const config = ts.readConfigFile(tsconfigPath, ts.sys.readFile)

  if (config.error) {
    throw new Error(formatDiagnostics([config.error], loadedTs, path.dirname(tsconfigPath)))
  }

  const parsed = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    path.dirname(tsconfigPath),
    undefined,
    tsconfigPath,
  )

  if (parsed.errors.length) {
    throw new Error(formatDiagnostics(parsed.errors, loadedTs, path.dirname(tsconfigPath)))
  }

  return parsed
}

async function writeOutputs(bundle: RollupBuild, ctx: BuildContext): Promise<string[]> {
  const baseName = path.basename(ctx.entry).replace(/\.[cm]?[tj]sx?$/, '')
  const written: string[] = []

  for (const format of ctx.formats) {
    const plain = createOutputOptions(ctx, format, outputFileName(baseName, format, false))
    await bundle.write(plain)
    written.push(plain.file as string)

    if (ctx.minify) {
      const minified = createOutputOptions(ctx, format, outputFileName(baseName, format, true), true)
      await bundle.write(minified)
      written.push(minified.file as string)
    }
  }

  return written
}

function createOutputOptions(
  ctx: BuildContext,
  format: BundleFormat,
  fileName: string,
  minify = false,
): OutputOptions {
  return {
    file: path.join(ctx.outDir, fileName),
    format,
    name: format === 'iife' ? ctx.name : undefined,
    sourcemap: ctx.sourcemap,
    exports: format === 'cjs' ? 'named' : undefined,
    globals: format === 'iife' ? createGlobals(ctx) : undefined,
    plugins: minify ? [terser()] : undefined,
  }
}

function outputFileName(baseName: string, format: BundleFormat, minify: boolean): string {
  if (format === 'es') {
    return `${baseName}${minify ? '.min' : ''}.mjs`
  }

  if (format === 'cjs') {
    return `${baseName}${minify ? '.min' : ''}.js`
  }

  return `${baseName}.iife${minify ? '.min' : ''}.js`
}

function createGlobals(ctx: BuildContext): Record<string, string> {
  const globals: Record<string, string> = {}

  for (const dependency of [
    ...Object.keys(ctx.pkg.dependencies ?? {}),
    ...Object.keys(ctx.pkg.peerDependencies ?? {}),
    ...Object.keys(ctx.pkg.optionalDependencies ?? {}),
    ...ctx.external,
  ]) {
    globals[dependency] = packageNameToGlobal(dependency)
  }

  return globals
}

function emitDeclarations(ctx: BuildContext, loadedTs: LoadedTypescript): void {
  const ts = loadedTs.module
  const parsed = readTsconfig(ctx.tsconfig, loadedTs)
  const outDir = path.join(ctx.cwd, 'types')
  const program = ts.createProgram({
    rootNames: parsed.fileNames.length ? parsed.fileNames : [ctx.entry],
    options: {
      ...parsed.options,
      declaration: true,
      declarationMap: false,
      emitDeclarationOnly: true,
      noEmit: false,
      outDir,
      declarationDir: outDir,
    },
  })
  const emitResult = program.emit()
  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics)
    .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)

  if (diagnostics.length) {
    throw new Error(formatDiagnostics(diagnostics, loadedTs, ctx.cwd))
  }
}

function formatDiagnostics(
  diagnostics: readonly import('typescript').Diagnostic[],
  loadedTs: LoadedTypescript,
  cwd: string,
): string {
  const ts = loadedTs.module
  const host: import('typescript').FormatDiagnosticsHost = {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => cwd,
    getNewLine: () => '\n',
  }

  return ts.formatDiagnosticsWithColorAndContext(diagnostics, host)
}

function targetToScriptTarget(
  target: string | undefined,
  ts: typeof import('typescript'),
): import('typescript').ScriptTarget | undefined {
  if (!target) {
    return undefined
  }

  if (target === 'node') {
    return ts.ScriptTarget.ES2019
  }

  if (target === 'web') {
    return ts.ScriptTarget.ES2018
  }

  return undefined
}
