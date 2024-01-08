import { Button, message, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ObjectBlock from '@/components/ObjectBlock';
import {
  mainLocalStorage,
  chromeLocalStorage,
  mainLocation,
  mainSessionStorage,
  mainCookie,
} from '@/proxy';
import { copyToClipboard } from '@/utils';
import { generateAcrossDeviceUrl } from '@/data';
import SimpleTabs from '@/common/SimpleTabs';

const INIT_STORE: IStore = { localStorage: {}, sessionStorage: {}, cookie: {} };

function useInit(): [IStore, (store: IStore) => void] {
  const isSetRef = useRef(false);
  const [store, setStore] = useState<IStore>(INIT_STORE);

  function fetchStore() {
    if (isSetRef.current) return;
    Promise.all([
      mainLocalStorage.getCurrent(),
      mainSessionStorage.getCurrent(),
      mainCookie.getCurrent(),
    ]).then((list) => {
      const [localStorage, sessionStorage, cookie] = list.map((x) => x?.data || {});
      isSetRef.current = true;
      setStore({
        sessionStorage,
        localStorage,
        cookie,
      });
    });
  }

  useEffect(() => {
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
  return [store, setStore];
}

export default function () {
  const [page, setPage] = useInit(); // useState<IStore>(INIT_STORE);
  const [local, setLocal] = useState<IStore>(INIT_STORE);

  const [localActiveKey, setLocalActiveKey] = useState<IStoreKey>('localStorage');
  const [pageActiveKey, setPageActiveKey] = useState<IStoreKey>('localStorage');

  // 切换暂存用户
  function switchCache() {
    setPage(local);
    mainLocalStorage.replace(local.localStorage);
    mainSessionStorage.replace(local.sessionStorage);
  }

  // 保存到暂存用户
  function saveCache() {
    chromeLocalStorage.save(page).then(() => {
      chromeLocalStorage.get().then((local) => {
        setLocal(local);
      });
    });
  }

  // 生成跨设备链接
  function genAcrossDeviceUrl() {
    mainLocation.get().then(({ data: _mainLocation }) => {
      // 压缩到2000个字符串长度
      const url = generateAcrossDeviceUrl(_mainLocation.href, page);
      if (url.length > 8000) {
        message.warn(
          <span>
            超出最大长度8000, 请使用 <span style={{ color: 'green' }}>IIFE模式</span>
          </span>,
          1,
        );
        return;
      }
      copyToClipboard(url).then(() => {
        message.success('复制成功', 1);
      });
    });
  }

  // 生成iife函数
  function genIIFE() {
    Promise.all([
      mainLocalStorage.getCurrent(),
      mainSessionStorage.getCurrent(),
      mainCookie.getCurrent(),
      mainLocation.get(),
    ]).then((res) => {
      const [_localStorage, _sessionStorage, _cookie, _location] = res.map((x) => x?.data || {});
      const iife =
        // 清空cookie
        '(() => {' +
        '(function () {' +
        'const keys = document.cookie.match(/[^ =;]+(?==)/g) || [];' +
        'keys.forEach(key => {' +
        'document.cookie = key + "=0;expires=" + new Date(0).toUTCString();' +
        '})' +
        '})();' +
        // 替换localStorage
        `const o = ${JSON.stringify(_localStorage || {})};` +
        'localStorage.clear();' +
        'for (const k in o) {localStorage[k]=o[k]};' +
        // 替换sessionStorage
        `const s = ${JSON.stringify(_sessionStorage)};` +
        'sessionStorage.clear();' +
        'for (const k in o) {sessionStorage[k]=o[k]};' +
        // 替换cookie
        `const cookies = ${JSON.stringify(_cookie)};` +
        'const cookieKeys = Object.keys(cookies);' +
        'const cookieHelper = window.cookieStore || {' +
        'async set (cookie) {' +
        'document.cookie= `${cookie?.name || ""}=${cookie?.value || ""}`' +
        '},' +
        '};' +
        // 写入cookie
        // 'console.log("cookieKeys", cookieKeys);' +
        'cookieKeys.map(k => cookieHelper.set(cookies[k]));' +
        `window.location.href = "${_location.href || ''}";` +
        '})();';
      copyToClipboard(iife).then(() => {
        message.success('复制成功（打开浏览器控制台运行iife）', 1);
      });
    });
  }

  // 清空暂存
  function clearCache() {
    chromeLocalStorage.clear().then(() => {
      setLocal(INIT_STORE);
    });
  }

  // 清空主页面数据
  function clearMain() {
    Promise.all([mainLocalStorage.clear(), mainSessionStorage.clear()]).then(() => {
      setPage(INIT_STORE);
    });
  }

  // 退出登录
  function exitLogin() {
    Promise.all([mainLocalStorage.clear(), mainSessionStorage.clear()]).then(() => {
      setPage(INIT_STORE);
      mainLocation.reload();
    });
  }

  useEffect(() => {
    // 获取暂存
    chromeLocalStorage.get().then((local) => {
      setLocal(local);
      setLocalActiveKey('localStorage');
    });
  }, []);

  return (
    <div style={{ width: 450, padding: '14px 16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Space>
          <Button onClick={genAcrossDeviceUrl}>复制跨设备链接</Button>
          <Button onClick={genIIFE}>复制IIFE</Button>
        </Space>

        <Space size={12}>
          <Button type={'primary'} onClick={switchCache}>
            切换
          </Button>
          <Button type={'primary'} onClick={saveCache}>
            保存
          </Button>
        </Space>
      </div>
      <Space style={{ width: '100%' }} direction={'vertical'}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space style={{ color: 'rgb(197, 197, 197)', fontSize: 12 }}>
            <span>暂存</span>
            <SimpleTabs
              value={localActiveKey}
              onChange={setLocalActiveKey as any}
              options={[
                { label: 'localStorage', value: 'localStorage' },
                { label: 'sessionStorage', value: 'sessionStorage' },
                { label: 'cookie', value: 'cookie' },
              ]}
            />
          </Space>
          <Space>
            <a onClick={clearCache}>清空</a>
          </Space>
        </div>
        <ObjectBlock
          style={{ height: 155, border: '1px solid #e8e8e8', overflowY: 'auto' }}
          data={local[localActiveKey]}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space style={{ color: 'rgb(197, 197, 197)', fontSize: 12 }}>
            <span>页面</span>
            <SimpleTabs
              value={pageActiveKey}
              onChange={setPageActiveKey as any}
              options={[
                { label: 'localStorage', value: 'localStorage' },
                { label: 'sessionStorage', value: 'sessionStorage' },
                { label: 'cookie', value: 'cookie' },
              ]}
            />
          </Space>
          <Space>
            <a onClick={clearMain}>清空</a>
            <a onClick={exitLogin}>登出</a>
          </Space>
        </div>
        <ObjectBlock
          style={{ height: 155, border: '1px solid #e8e8e8', overflowY: 'auto' }}
          data={page[pageActiveKey]}
        />
      </Space>
    </div>
  );
}
