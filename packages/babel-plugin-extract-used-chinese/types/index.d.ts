import type { PluginObj } from '@babel/core';
export interface Option {
    app?: string;
}
/**
 * 提取jsx中的汉字
 * @param param0
 * @returns
 */
export default function (api: ThisType<Option>, options: Option): PluginObj;
