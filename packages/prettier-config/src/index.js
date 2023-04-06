/**
 * @type {import('prettier').Config}
 */
const prettierConfig = {
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  semi: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // html, vue, jsx 中每个属性占一行
  singleAttributePerLine: false,
  // 换行符使用 lf
  endOfLine: 'lf',
  trailingComma: 'es5',
  useTabs: false,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  bracketSameLine: false,
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // vue 文件中的 script 和 style 内不用缩进
  vueIndentScriptAndStyle: false,
  // 格式化嵌入的内容
  embeddedLanguageFormatting: 'auto',
  // NOTE Overrides let you have different configuration for certain file extensions, folders and specific files.
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      options: {
        parser: 'typescript',
      },
    },
  ],
}

export default prettierConfig
