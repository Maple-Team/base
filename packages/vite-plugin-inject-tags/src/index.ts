import type { HtmlTagDescriptor, Plugin } from 'vite'

export default function VitePluginInjectTags(tags: HtmlTagDescriptor[]): Plugin {
  return {
    name: 'vite-plugin-inject-tags',
    transformIndexHtml: (html: string) => {
      return {
        html,
        tags,
      }
    },
  }
}
