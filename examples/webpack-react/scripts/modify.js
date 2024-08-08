const fs = require('fs')

const updateContent = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8').toString()
  fs.writeFileSync(filePath, `${content}\r\nconsole.error('123')`, { encoding: 'utf-8' })
}

const iterDir = (inputDir) => {
  const files = fs.readdirSync(inputDir)
  files.forEach((file) => {
    const filePath = `${inputDir}/${file}`
    if (fs.statSync(filePath).isDirectory()) {
      iterDir(filePath)
    } else {
      if (file.endsWith('.ts')
        // || file.endsWith('.tsx')
      ) {
        updateContent(filePath)
      }
    }
  })
}

iterDir('../src')
