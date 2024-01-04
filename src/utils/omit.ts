/**
 * 去除对象中某些key
 *
 * At 2024/1/3
 * By TangJiaHui
 */
export function omit (object: IObject, excludeKeys: string[]) {
  const result: IObject = {};
  Object.keys(object).forEach(k => {
    if (!excludeKeys.includes(k)) {
      result[k] = object[k];
    }
  })
  return result;
}
