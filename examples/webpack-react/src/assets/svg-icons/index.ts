// const requireAll = (requireContext: AnyToFix) => requireContext.keys().map(requireContext)
// const req = require.context('@/assets/svg-icons', true, /\.svg$/)

// requireAll(req)

const cache: { [key: string]: unknown } = {}

function importAll(r: AnyToFix) {
  r.keys().forEach((key: string | number) => (cache[key] = r(key)))
}
// @ts-ignore
importAll(require.context('.', true, /\.svg$/))
