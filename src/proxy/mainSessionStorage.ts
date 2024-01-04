/**
 * 代理主页面的localStorage（非popup页的）
 *
 * At 2023/12/28
 * By TangJiaHui
 */
import {popup} from "@/data";

class MainSessionStorage {
  async getCurrent () {
    return popup.sendContent({
      type: 'sessionStorage',
      data: {
        opt: 'getCurrent'
      }
    })
  }

  async clear () : Promise<ResponseData> {
    return popup.sendContent({
      type: 'sessionStorage',
      data: {
        opt: 'clear'
      }
    })
  }

  async getItem (key: string): Promise<ResponseData> {
    return popup.sendContent({
      type: 'sessionStorage',
      data: {
        opt: 'getItem',
        data: key
      }
    })
  }

  async removeItem(key: string): Promise<ResponseData> {
    return popup.sendContent({
      type: 'sessionStorage',
      data: {
        opt: 'removeItem',
        data: key
      }
    })
  }

  async setItem(key: string, value: string): Promise<ResponseData> {
    return popup.sendContent({
      type: 'sessionStorage',
      data: {
        opt: 'setItem',
        data: [key, value]
      }
    })
  }

  async key(index: number): Promise<ResponseData> {
    return popup.sendContent({
      type: 'sessionStorage',
      data: {
        opt: 'key',
        data: index
      }
    })
  }

  // 完整替换原先的localStorage
  async replace (data: {[K: string]: any}): Promise<ResponseData> {
    return popup.sendContent({
      type: 'sessionStorage',
      data: {
        opt: 'replace',
        data: data
      }
    })
  }
}

export const mainSessionStorage = new MainSessionStorage();
