/**
 * chrome扩展的localStorage
 *
 * At 2024/1/3
 * By TangJiaHui
 */
export const chromeLocalStorage = {
  async save (localStorage: IObject) {
    return chrome.storage.local.set({ localStorage })
  },
  async get () {
    if (__DEV__) return localStorage;
    return chrome.storage.local.get().then(res => res?.['localStorage'] || {})
  },
  async clear () {
    return chrome.storage.local.remove('localStorage')
  }
}
