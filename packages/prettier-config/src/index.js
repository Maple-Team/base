/**
 * @type {import('prettier').Config}
 */
 const prettierConfig = {
   singleQuote: true,
   printWidth: 120,
   tabWidth: 2,
   semi: false,
   arrowParens: "always",
   singleAttributePerLine: true,
   endOfLine: "lf",
   trailingComma: "es5",
   useTabs: false,
   quoteProps: "as-needed",
   jsxSingleQuote: false,
   bracketSpacing: true,
   bracketSameLine: false,
   rangeStart: 0,
   rangeEnd: Infinity,
   requirePragma: false,
   insertPragma: false,
   proseWrap: "preserve",
   htmlWhitespaceSensitivity: "css",
   overrides: [
     {
       files: "*.ts",
       options: {
         parser: "typescript",
       },
     },
   ],
 };

export default prettierConfig
