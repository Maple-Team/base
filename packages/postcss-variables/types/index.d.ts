import type { PluginCreator } from 'postcss';
export interface Options {
    nestingPlugin?: string;
    variables: Record<string, string>;
}
declare const plugincssVariables: PluginCreator<Options>;
export default plugincssVariables;
