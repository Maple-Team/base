import { PluginObj } from '@babel/core';
export interface Option {
    exclude?: string[];
}
/**
 * 移除代码中的console.xxx
 * @param param0
 * @returns
 */
export default function ({ types: t }: {
    types: typeof import('@babel/types');
}): PluginObj;
