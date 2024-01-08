/**
 * popup 封装Api
 *
 * At 2023/12/28
 * By TangJiaHui
 */
import { v4 as uuid } from 'uuid';

// 等待返回请求队列;
export const popupReceiveList = new Map<string, (payload: any) => void>();

export const popup = {
  // 发送到content
  async sendContent(payload: SendDataPayload): Promise<ResponseData> {
    if (__DEV__) {
      return Promise.resolve({
        success: true,
      });
    }
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
        const tabId = tabs?.[0]?.id;
        if (tabId) {
          const id = uuid();
          chrome.tabs.sendMessage(tabId, { payload, from: 'popup', id });
          popupReceiveList.set(id, (payload) => {
            resolve(payload);
            popupReceiveList.delete(id);
          });
        } else {
          reject('tabId is not exist.');
        }
      });
    });
  },
};

export function popupListen() {
  if (__DEV__) return;
  chrome.runtime.onMessage.addListener((req) => {
    // 处理来自content的数据
    if (req.from === 'content') {
      // 处理回调请求
      if (req.id) {
        const resolve = popupReceiveList.get(req.id);
        if (resolve) {
          resolve(req.payload);
        }
      }
    }
  });
}
