/**
 * 初始化popup的data
 *
 * At 2024/1/8
 * By TangJiaHui
 */
import { useEffect, useRef, useState } from 'react';
import { mainCookie, mainLocalStorage, mainSessionStorage } from '@/proxy';

export function useInitPopup(initial: IStore): [IStore, (store: IStore) => void, boolean] {
  const isSetRef = useRef(false);
  const [store, setStore] = useState<IStore>(initial);
  const [loading, setLoading] = useState<boolean>(false);

  function fetchStore() {
    if (isSetRef.current) return;
    Promise.all([
      mainLocalStorage.getCurrent(),
      mainSessionStorage.getCurrent(),
      mainCookie.getCurrent(),
    ]).then((list) => {
      const [localStorage, sessionStorage, cookie] = list.map((x) => x?.data || {});
      isSetRef.current = true;
      setLoading(false);
      setStore({
        sessionStorage,
        localStorage,
        cookie,
      });
    });
  }

  useEffect(() => {
    setLoading(true);
    // 处理content已加载完成的情况（content加载完成后，popup打开）
    fetchStore();

    if (!__DEV__) {
      // 处理content首次挂载（content未加载完成，popup打开）
      chrome?.runtime?.onMessage?.addListener((request, sender, sendResponse) => {
        if (request.from === 'content' && !request.id) {
          if (request.payload.isMount) {
            fetchStore();
          }
        }
      });
    }
  }, []);
  return [store, setStore, loading];
}
