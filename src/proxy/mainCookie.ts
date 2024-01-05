/**
 * 拦截当前页的cookie
 *
 * At 2024/1/5
 * By TangJiaHui
 */
import { popup } from '@/data';

export const mainCookie = {
  async get(name: string) {
    return popup.sendContent({
      type: 'cookieStorage',
      data: {
        opt: 'get',
        data: name,
      },
    });
  },
  async getCurrent() {
    return popup.sendContent({
      type: 'cookieStorage',
      data: {
        opt: 'getCurrent',
      },
    });
  },
  async remove(name: string) {
    return popup.sendContent({
      type: 'cookieStorage',
      data: {
        opt: 'remove',
        data: name,
      },
    });
  },
  async replace(cookieStorage: CookieStorage) {
    return popup.sendContent({
      type: 'cookieStorage',
      data: {
        opt: 'replace',
        data: cookieStorage,
      },
    });
  },
};
