const getEntryPointPaths = (resolveApp, resolveModule) => {
  require('dotenv').config()
  const entrypoints = require('./entrypoints')

  const filtered = Object.entries(entrypoints.profiles).filter((profile) => {
    return profile[0] === process.env.APP_PROFILE
  })
  const profiles = filtered.length === 0 ? Object.entries(entrypoints.profiles)[0] : filtered

  const files = Object.entries(entrypoints.files).map((entrypoint) => [
    entrypoint[0],
    {
      folder: entrypoint[1].folder,
      htmlname: entrypoint[1].html.replace('public/', ''),
      open: entrypoint[0] === profiles[0][1][0],
      js: resolveModule(resolveApp, entrypoint[1].js),
      html: resolveApp(entrypoint[1].html),
    },
  ])

  const entries = profiles[0][1].map((p) => {
    return files.find((f) => p === f[0])
  })

  return entries
}

const getRequiredFilesList = (entrypoints) => {
  return entrypoints
    .map((entry) => {
      return Object.entries(entry[1])
        .filter((f) => ['js', 'html'].includes(f[0]))
        .map((f) => f[1])
    })
    .reduce((a, seq) => {
      return a.concat(seq)
    }, [])
}

const getBrowserFolder = (entrypoints) => {
  const entry = entrypoints.find((f) => f[1].open && f[1].folder)
  return entry ? entry[1].folder : undefined
}

const getWebPackPlugins = (entrypoints) => {
  return entrypoints.map((entry) => {
    return {
      chunkname: entry[0],
      filename: entry[1].htmlname,
      template: entry[1].html,
    }
  })
}
const getEntryPoints = (entries) => {
  return [
    ...entries.map((e) => {
      return [e[0], { ...e[1] }]
    }),
  ]
}

module.exports.getEntryPointPaths = getEntryPointPaths
module.exports.getRequiredFilesList = getRequiredFilesList
module.exports.getBrowserFolder = getBrowserFolder
module.exports.getWebPackPlugins = getWebPackPlugins
module.exports.getEntryPoints = getEntryPoints
