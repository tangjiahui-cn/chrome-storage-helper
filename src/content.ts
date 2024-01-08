/**
 * 监听message
 *
 * At 2023/12/29
 * By TangJiaHui
 */
import { ContentPlugin } from '@/model';
import LocalStoragePlugin from '@/content-plugin/localStorage';
import LocationPlugin from '@/content-plugin/location';
import SessionStorage from '@/content-plugin/sessionStorage';
import System from '@/content-plugin/system';
import { parser } from '@/data';
import CookieStorage from '@/content-plugin/cookieStorage';

// 校验跨设备链接
parser();

const contentPlugins = new ContentPlugin();
contentPlugins.use(LocalStoragePlugin);
contentPlugins.use(LocationPlugin);
contentPlugins.use(SessionStorage);
contentPlugins.use(System);
contentPlugins.use(CookieStorage);

if (!__DEV__) {
  sendPopup('', { isMount: true });
  chrome?.runtime?.onMessage?.addListener((request, sender, sendResponse) => {
    contentPlugins.process(request.payload).then((data) => {
      sendPopup(request.id, {
        success: true,
        data,
      });
    });
  });

  function sendPopup(id: string, payload: SendDataPayload) {
    chrome.runtime.sendMessage({
      id,
      payload,
      from: 'content',
    });
  }
}
