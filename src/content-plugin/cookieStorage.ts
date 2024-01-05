/**
 * 处理cookie的插件
 *
 * At 2024/1/5
 * By TangJiaHui
 */
import { getCookieStore } from '@/utils';
import { cloneDeep, result } from 'lodash';

export type Data = {
  opt: 'get' | 'getCurrent' | 'remove' | 'replace';
  data: string | string[] | number | { [K: string]: any };
};

export default {
  id: 'cookieStorage',
  async handle(data: Data) {
    const cookieStore = getCookieStore();
    let key: string, value: any;
    if (Array.isArray(data.data)) {
      [key = '', value = ''] = data.data;
    } else {
      key = data.data as any;
    }

    switch (data.opt) {
      case 'replace':
        if (typeof data.data === 'object' && data.data && !Array.isArray(data.data)) {
          const values = Object.values(data.data);
          return Promise.all(values.map((cookie) => cookieStore.set(cookie)));
        }
        break;
      case 'getCurrent':
        const cookies = await cookieStore.getAll();
        const result: any = {};
        cookies.forEach((cookie) => (result[cookie.name] = cookie));
        return result;
      case 'get':
        return cookieStore.get(data.data as string);
      case 'remove':
        return cookieStore.delete(data.data as string);
      default:
        break;
    }
  },
};
