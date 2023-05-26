import type { PluginObj } from '@babel/core';
export interface Option {
}
/**
 * react组件注入console.count('xxxx')
 * @param param0
 * @returns
 */
export default function ({ types: t }: {
    types: typeof import('@babel/types');
}): PluginObj;
