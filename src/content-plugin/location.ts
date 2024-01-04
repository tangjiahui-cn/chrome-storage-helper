/**
 * 处理location的插件
 *
 * At 2023/12/29
 * By TangJiaHui
 */
type Data = {
  opt: 'reload' | 'get';
  data?: any;
};

export default {
  id: 'location',
  async handle(data: Data) {
    switch (data.opt) {
      case 'reload':
        window.location.reload();
        break;
      case 'get':
        return window.location;
      default:
        break;
    }
  },
};
