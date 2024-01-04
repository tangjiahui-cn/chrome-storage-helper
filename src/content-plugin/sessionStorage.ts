/**
 * 处理sessionStorage的插件
 *
 * At 2023/12/29
 * By TangJiaHui
 */
export type Data = {
  opt: 'replace' | 'getCurrent' | 'clear' | 'getItem' | 'removeItem' | 'key' | 'setItem';
  data: string | string[] | number | { [K: string]: any };
};

export default {
  id: 'sessionStorage',
  async handle(data: Data) {
    let key: string, value: any;
    if (Array.isArray(data.data)) {
      [key = '', value = ''] = data.data;
    } else {
      key = data.data as any;
    }

    switch (data.opt) {
      case 'replace':
        if (typeof data.data === 'object' && data.data && !Array.isArray(data.data)) {
          for (const k in data?.data as any) {
            window.sessionStorage.setItem(k, data?.data?.[k]);
          }
        }
        break;
      case 'getCurrent':
        return window.sessionStorage;
      case 'clear':
        window.sessionStorage.clear();
        break;
      case 'setItem':
        window.sessionStorage.setItem(key, value);
        break;
      case 'getItem':
        return window.sessionStorage.getItem(key);
      case 'key':
        return window.sessionStorage.key(key as any);
        break;
      case 'removeItem':
        window.sessionStorage.removeItem(key);
        break;
      default:
        break;
    }
  },
};
