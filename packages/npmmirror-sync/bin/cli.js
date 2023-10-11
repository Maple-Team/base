#!/usr/bin/env node
'use strict'

const pkgName = process.env.npm_package_name
const https = require('node:https')

if (!pkgName) {
  console.error('[@liutsing/npmmirror-sync] Error 404: Package name is missing!')
  process.exit(1)
}

const options = {
  hostname: 'registry-direct.npmmirror.com',
  port: 443,
  path: `/-/package/${pkgName}/syncs`,
  method: 'PUT',
}

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`)

  res.on('data', (data) => {
    console.log(data.toString())
  })
})

req.on('error', (error) => {
  console.error(error)
})

req.end()
