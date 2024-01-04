/**
 * 处理localStorage的插件
 *
 * At 2023/12/29
 * By TangJiaHui
 */
export type Data = {
  opt: 'replace' | 'getCurrent' | 'clear' | 'getItem'  | 'removeItem' | 'key' | 'setItem';
  data: string | string[] | number | {[K: string]: any};
}

export default {
  id: 'localStorage',
  async handle (data: Data) {
    let key: string, value: any;
    if (Array.isArray(data.data)) {
      [key = '', value = ''] = data.data;
    } else {
      key = data.data as any;
    }

    switch (data.opt) {
      case 'replace':
        if (typeof data.data === 'object' && data.data && !Array.isArray(data.data)) {
          for (const k in (data?.data as any)) {
            window.localStorage.setItem(k, data?.data?.[k])
          }
        }
        break;
      case 'getCurrent':
        return window.localStorage;
      case "clear":
        window.localStorage.clear();
        break;
      case 'setItem':
        window.localStorage.setItem(key, value)
        break;
      case "getItem":
        return window.localStorage.getItem(key)
      case "key":
        return window.localStorage.key(key as any)
        break;
      case "removeItem":
        window.localStorage.removeItem(key)
        break;
      default:
        break;
    }
  }
}
