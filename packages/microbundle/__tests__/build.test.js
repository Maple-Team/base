const childProcess = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const vm = require('node:vm')
const { build } = require('../dist/index.js')

describe('@liutsing/microbundle', () => {
  test('builds esm, cjs, iife, minified files, sourcemaps, declarations, and externals', async () => {
    const fixture = createFixture('api-build')

    writeFile(
      fixture,
      'package.json',
      JSON.stringify(
        {
          name: '@scope/api-build',
          source: 'src/index.ts',
          dependencies: {
            'external-lib': '^1.0.0',
          },
          sideEffects: false,
        },
        null,
        2,
      ),
    )
    writeFile(
      fixture,
      'tsconfig.json',
      JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2019',
            module: 'ESNext',
            moduleResolution: 'Node',
            strict: true,
            skipLibCheck: true,
          },
          include: ['src'],
        },
        null,
        2,
      ),
    )
    writeFile(
      fixture,
      'src/external-lib.d.ts',
      "declare module 'external-lib' {\n  export const value: string\n}\n",
    )
    writeFile(
      fixture,
      'src/index.ts',
      [
        "import { value } from 'external-lib'",
        '',
        'export const answer = 42',
        "export const label = `${value}:answer`",
        "export const unused = () => 'kept as a named export'",
      ].join('\n'),
    )

    const result = await build({ cwd: fixture })

    expect(result.files.map((file) => path.relative(fixture, file)).sort()).toEqual([
      'dist\\index.iife.js',
      'dist\\index.iife.min.js',
      'dist\\index.js',
      'dist\\index.min.js',
      'dist\\index.min.mjs',
      'dist\\index.mjs',
    ])

    for (const file of [
      'dist/index.mjs',
      'dist/index.min.mjs',
      'dist/index.js',
      'dist/index.min.js',
      'dist/index.iife.js',
      'dist/index.iife.min.js',
    ]) {
      expect(fs.existsSync(path.join(fixture, file))).toBe(true)
      expect(fs.existsSync(path.join(fixture, `${file}.map`))).toBe(true)
    }

    const esm = fs.readFileSync(path.join(fixture, 'dist/index.mjs'), 'utf8')
    const cjs = fs.readFileSync(path.join(fixture, 'dist/index.js'), 'utf8')
    const declarations = fs.readFileSync(path.join(fixture, 'types/index.d.ts'), 'utf8')

    expect(esm).toContain("from 'external-lib'")
    expect(esm).toContain('export { answer, label, unused }')
    expect(cjs).toContain("require('external-lib')")
    expect(declarations).toContain('export declare const answer = 42')
  })

  test('builds test code through the CLI and produces executable outputs', async () => {
    const fixture = createFixture('cli-build')

    writeFile(
      fixture,
      'package.json',
      JSON.stringify(
        {
          name: 'cli-build',
          source: 'src/index.ts',
          sideEffects: false,
        },
        null,
        2,
      ),
    )
    writeFile(
      fixture,
      'tsconfig.json',
      JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2019',
            module: 'ESNext',
            moduleResolution: 'Node',
            strict: true,
            skipLibCheck: true,
          },
          include: ['src'],
        },
        null,
        2,
      ),
    )
    writeFile(
      fixture,
      'src/index.ts',
      [
        'export function add(left: number, right: number) {',
        '  return left + right',
        '}',
        '',
        'export const version = "1.0.0"',
      ].join('\n'),
    )

    const cli = path.resolve(__dirname, '..', 'dist', 'cli.js')
    const result = childProcess.spawnSync(
      process.execPath,
      [cli, 'src/index.ts', '--format', 'es,cjs,iifi', '--name', 'CliBuild'],
      {
        cwd: fixture,
        encoding: 'utf8',
      },
    )

    expect(result.status).toBe(0)
    expect(result.stderr).toBe('')

    const cjs = require(path.join(fixture, 'dist/index.js'))
    const esmResult = childProcess.spawnSync(
      process.execPath,
      [
        '--input-type=module',
        '--eval',
        "import('./dist/index.mjs').then((mod) => { if (mod.add(1, 2) !== 3) { process.exit(2) } console.log(String(mod.add(1, 2))) }).catch((error) => { console.error(error); process.exit(1) })",
      ],
      {
        cwd: fixture,
        encoding: 'utf8',
      },
    )
    const context = {}
    vm.runInNewContext(fs.readFileSync(path.join(fixture, 'dist/index.iife.js'), 'utf8'), context)

    expect(cjs.add(20, 22)).toBe(42)
    expect(esmResult.status).toBe(0)
    expect(esmResult.stdout.trim()).toBe('3')
    expect(context.CliBuild.add(2, 5)).toBe(7)
    expect(fs.existsSync(path.join(fixture, 'dist/index.iife.min.js'))).toBe(true)
    expect(fs.existsSync(path.join(fixture, 'types/index.d.ts'))).toBe(true)
  })
})

function createFixture(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `liutsing-microbundle-${name}-`))
}

function writeFile(root, relativePath, content) {
  const file = path.join(root, relativePath)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}
