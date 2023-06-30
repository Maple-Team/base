import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'rollup'

export default function writecss() {
  const result: Plugin = {
    name: '@liutsing/rollup-plugin-extract-style', // this name will show up in warnings and errors
    writeBundle(this, options, bundle) {
      // bundle: { [fileName: string]: AssetInfo | ChunkInfo }
      const indexCss = bundle['index.css']
      if (!indexCss) throw new Error('index.css not exists')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      fs.writeFile(path.resolve(process.cwd(), 'dist/index.css'), indexCss.source, (err) => {
        if (err) console.error(err)
      })
    },
  }
  return result
}
