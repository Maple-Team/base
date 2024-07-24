const { readFileSync } = require('fs')
const path = require('path')
const { minify_sync } = require('terser')

const dirname = path.dirname(__dirname)
const templatePath = path.join(dirname, './utils/template.html')
const templateContent = readFileSync(templatePath).toString()

const minfiyCode = (source) => {
  return minify_sync(
    {
      'file.js': source,
    },
    {
      compress: true,
      format: {
        comments: false,
      },
    }
  ).code
}

/**
 * @param {import('html-webpack-plugin').TemplateParameter} param
 * @returns
 */
const templateContentFn = ({ htmlWebpackPlugin, ...rest }) => {
  return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${htmlWebpackPlugin.options.title}</title>
  </head>
  <body>
    <div id="root">
      <div id="spin-mask-0525d3b0-4ada-47af-9638-93777ade95fc">
        <noscript>
          <style>
            #spin-mask-0525d3b0-4ada-47af-9638-93777ade95fc {
              display: none !important;
            }
            #protect-browser {
              display: none;
            }
          </style>
        </noscript>
        <style>
          @keyframes _doc-spin {
            to {
              transform: rotate(360deg);
            }
          }
          #spin-mask-0525d3b0-4ada-47af-9638-93777ade95fc {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: #fff;
            z-index: 9999;
          }
          #spin-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          #spin-container .spinner {
            box-sizing: border-box;
            display: inline-block;
            width: 2rem;
            height: 2rem;
            vertical-align: -0.125em;
            border: 0.25rem solid currentColor;
            border-right-color: transparent;
            color: ${rest.themeColor};
            border-radius: 50%;
            animation: 0.75s linear infinite _doc-spin;
          }
          #protect-browser {
            padding: 20px;
            text-align: center;
          }
        </style>
        <div id="spin-container">
          <div class="spinner"></div>
        </div>
        <div id="protect-browser"></div>
      </div>
    </div> 
  </body>
  <script>
  // TODO 待注入
const defaultList = [
  { name: 'Edge', version: '100' },
  { name: 'Firefox', version: '100' },
  { name: 'Chrome', version: '90' },
  { name: 'Safari', version: '15' },
  { name: 'IE' },
]
  window.defaultList = defaultList
  ${minfiyCode(readFileSync(path.resolve(dirname, './inject/check.js')).toString())}
  </script>
</html>
    `
}
const { meta } = require('./meta')

// 从这个项目中学习一些设定项目 incubator-answer

module.exports = { meta, templateContent, templateContentFn, minfiyCode }
