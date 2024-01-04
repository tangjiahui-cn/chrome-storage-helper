/**
 * 代理主页面的location（非popup页的）
 *
 * At 2023/12/29
 * By TangJiaHui
 */
import { popup } from '@/data';

class MainLocation {
  async reload() {
    return popup.sendContent({
      type: 'location',
      data: {
        opt: 'reload',
      },
    });
  }
  async get() {
    return popup.sendContent({
      type: 'location',
      data: {
        opt: 'get',
      },
    });
  }
}

export const mainLocation = new MainLocation();
