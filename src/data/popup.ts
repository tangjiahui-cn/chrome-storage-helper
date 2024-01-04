/**
 * popup 封装Api
 *
 * At 2023/12/28
 * By TangJiaHui
 */
export const popup = {
  // 发送到content
  async sendContent(payload: SendDataPayload): Promise<ResponseData> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
        const tabId = tabs?.[0]?.id;
        if (tabId) {
          chrome.tabs.sendMessage(tabId, { payload, from: 'popup' }, resolve);
        } else {
          reject('tabId is not exist.');
        }
      });
    });
  },
};
