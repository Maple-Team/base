declare type AnyToFix = any

declare module '*.less' {
  const css: AnyToFix
  export default css
}
declare module '*.modules.less' {
  const css: AnyToFix
  export default css
}
declare module '*.css' {
  const css: AnyToFix
  export default css
}
declare module '*.scss' {
  const css: AnyToFix
  export default css
}
declare module '*.styl' {
  const css: AnyToFix
  export default css
}
declare module '*.modules.css' {
  const css: AnyToFix
  export default css
}
declare module '*.png' {
  const src: string
  export default src
}
declare module '*.jpg' {
  const src: string
  export default src
}
declare module '*.jpeg' {
  const src: string
  export default src
}
declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

// fonts
declare module '*.woff' {
  const src: string
  export default src
}
declare module '*.woff2' {
  const src: string
  export default src
}

declare module 'process' {
  global {
    namespace NodeJS {
      export interface ProcessEnv {
        tag: 'dev' | 'test' | 'pro'
        mode: 'dev' | 'test' | 'pro'
        version: string
      }
    }
  }
}
