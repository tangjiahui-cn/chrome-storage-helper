/**
 * 代理主页面的localStorage（非popup页的）
 *
 * At 2023/12/28
 * By TangJiaHui
 */
import {popup} from "@/data";

class MainLocalStorage {
  async getCurrent () {
    if (__DEV__) {
      return Promise.resolve({
        success: true,
        data: localStorage
      })
    }
    return popup.sendContent({
      type: 'localStorage',
      data: {
        opt: 'getCurrent'
      }
    })
  }

  async clear () : Promise<ResponseData> {
    return popup.sendContent({
      type: 'localStorage',
      data: {
        opt: 'clear'
      }
    })
  }

  async getItem (key: string): Promise<ResponseData> {
    return popup.sendContent({
      type: 'localStorage',
      data: {
        opt: 'getItem',
        data: key
      }
    })
  }

  async removeItem(key: string): Promise<ResponseData> {
    return popup.sendContent({
      type: 'localStorage',
      data: {
        opt: 'removeItem',
        data: key
      }
    })
  }

  async setItem(key: string, value: string): Promise<ResponseData> {
    return popup.sendContent({
      type: 'localStorage',
      data: {
        opt: 'setItem',
        data: [key, value]
      }
    })
  }

  async key(index: number): Promise<ResponseData> {
    return popup.sendContent({
      type: 'localStorage',
      data: {
        opt: 'key',
        data: index
      }
    })
  }

  // 完整替换原先的localStorage
  async replace (data: {[K: string]: any}): Promise<ResponseData> {
    return popup.sendContent({
      type: 'localStorage',
      data: {
        opt: 'replace',
        data: data
      }
    })
  }
}

export const mainLocalStorage = new MainLocalStorage();
