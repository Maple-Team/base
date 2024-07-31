const path = require('path')
const { declare } = require('@babel/helper-plugin-utils')

const getAbsoluteRuntimePath = () => {
  return path.dirname(require.resolve('@babel/runtime/package.json'))
}

module.exports = ({
  targets,
  ignoreBrowserslistConfig = false,
  forceAllTransforms = false,
  transformRuntime = true,
  absoluteRuntime = false,
  supportsDynamicImport = false,
} = {}) => {
  return declare((api, { modules = 'auto', absoluteRuntimePath = getAbsoluteRuntimePath() }) => {
    api.assertVersion(7)
    // 返回配置内容
    return {
      // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
      sourceType: 'unambiguous',
      exclude: /@babel\/runtime/,
      presets: [
        [
          require('@babel/preset-env').default,
          {
            // 统一 @babel/preset-env 配置
            useBuiltIns: false,
            modules,
            targets,
            ignoreBrowserslistConfig,
            forceAllTransforms,
            exclude: ['transform-typeof-symbol'],
          },
        ],
      ],
      plugins: [
        transformRuntime && [
          require('@babel/plugin-transform-runtime').default,
          {
            absoluteRuntime: absoluteRuntime ? absoluteRuntimePath : false,
          },
        ],
        require('@babel/plugin-syntax-dynamic-import').default,
        !supportsDynamicImport &&
          !api.caller((caller) => caller && caller.supportsDynamicImport) &&
          require('babel-plugin-dynamic-import-node'),
        [require('@babel/plugin-proposal-object-rest-spread').default, { loose: true, useBuiltIns: true }],
      ].filter(Boolean),

      env: {
        test: {
          presets: [
            [
              require('@babel/preset-env').default,
              {
                useBuiltIns: false,
                targets: { node: 'current' },
                ignoreBrowserslistConfig: true,
                exclude: ['transform-typeof-symbol'],
              },
            ],
          ],
          plugins: [
            [
              require('@babel/plugin-transform-runtime').default,
              {
                absoluteRuntime: absoluteRuntimePath,
              },
            ],
            require('babel-plugin-dynamic-import-node'),
          ],
        },
      },
    }
  })
}
