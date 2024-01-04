/**
 * 一些页面操作集合
 *
 * At 2023/12/29
 * By TangJiaHui
 */

type Data = {
  opt: 'copyToClipboard'; // 复制到粘贴板
  data?: any;
};

export default {
  id: 'system',
  async handle(data: Data) {
    switch (data.opt) {
      case 'copyToClipboard':
        const input = document.createElement('textarea');
        input.value = data.data;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        break;
      default:
        break;
    }
  },
};
