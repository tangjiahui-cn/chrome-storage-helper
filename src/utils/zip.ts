/**
 * 压缩/解压缩 字符串
 *
 * At 2024/1/4
 * By TangJiaHui
 */
import LZString from 'lz-string';

export function zip(str: string) {
  return LZString.compress(str);
}

export function unZip(str: string) {
  return LZString.decompress(str);
}

export function stringify(o: any) {
  return o ? JSON.stringify(o) : '';
}

export function unStringify(str: string = '') {
  return str ? JSON.parse(str) : '';
}
