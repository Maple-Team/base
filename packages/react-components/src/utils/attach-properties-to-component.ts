/**
 * react组件对象拓展属性
 * @param el
 * @param properties
 * @returns
 */
export function attachPropertiesToComponent<C, P extends Record<string, AnyToFix>>(component: C, properties: P): C & P {
  const ret = component as AnyToFix
  for (const key in properties) if (Object.prototype.hasOwnProperty.call(properties, key)) ret[key] = properties[key]

  return ret
}
