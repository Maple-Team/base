import type { PluginObj } from '@babel/core';
export interface Option {
    filename: string;
}
/**
 * 提取jsx中的汉字
 * @param param0
 * @returns
 */
export default function (_: ThisType<Option>, options: Option): PluginObj;
