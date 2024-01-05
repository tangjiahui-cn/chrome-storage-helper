/**
 * 获取 cookieStore
 *
 * At 2024/1/5
 * By TangJiaHui
 */
import Cookies from 'js-cookie';

const getCookieIns = (function () {
  let ins: CookieStore | undefined = undefined;
  return function (): CookieStore {
    return (
      ins ||
      (ins = {
        async set(cookie: Cookie) {
          Cookies.set(cookie.name, cookie.value || '');
        },
        async get(name: string) {
          const value = Cookies.get(name) || '';
          return { name, value };
        },
        async getAll() {
          const cookieObj = Cookies.get();
          return Object.keys(cookieObj).map((name) => ({
            name,
            value: cookieObj[name] || '',
          }));
        },
        async delete(name: string) {
          Cookies.remove(name);
        },
      })
    );
  };
})();

export function getCookieStore(): CookieStore {
  return window.cookieStore || getCookieIns();
}
