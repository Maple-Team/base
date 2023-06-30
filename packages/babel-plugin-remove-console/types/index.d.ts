import { PluginObj } from '@babel/core';
export interface Option {
    /**
     * 排除的项，如debug、error、warn等
     */
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
