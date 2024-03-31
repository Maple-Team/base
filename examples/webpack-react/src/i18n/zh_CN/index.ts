// eslint-disable-next-line import/no-mutable-exports
let locales: { [key: string]: unknown } = {}

function importAll(r: __WebpackModuleApi.RequireContext) {
  r.keys().forEach((key: string) => {
    locales = { ...locales, ...r(key) }
  })
}
importAll(require.context('.', true, /\.json$/))

export default locales
