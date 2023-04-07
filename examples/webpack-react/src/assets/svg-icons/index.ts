const cache: { [key: string]: unknown } = {}

function importAll(r: __WebpackModuleApi.RequireContext) {
  r.keys().forEach((key: string) => (cache[key] = r(key)))
}
importAll(require.context('.', true, /\.svg$/, 'lazy'))
