/**
 * 提取对象中某些key
 *
 * At 2024/1/3
 * By TangJiaHui
 */
export function pick(object: IObject, includeKeys: string[]) {
  const result: IObject = {};
  includeKeys.forEach((k) => {
    result[k] = object[k];
  });
  return result;
}
