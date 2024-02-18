import { Button, Checkbox, message, Space } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
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
import { useInitPopup } from '@/hooks';
import { QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import Dynamic from '@/common/Dynamic';
import { en_US, Locale, LocaleProvider, useLocale, zh_CN } from '@/locales';
import Tooltip from 'antd/es/tooltip';

const INIT_STORE: IStore = { localStorage: {}, sessionStorage: {}, cookie: {} };

const LOCALE_MAP = {
  1: zh_CN,
  2: en_US,
};

export default function () {
  const [localeType, setLocaleType] = useState<1 | 2>(1);
  const locale = useMemo(() => LOCALE_MAP[localeType], [localeType]);
  const [page, setPage, loading] = useInitPopup(INIT_STORE);
  const [local, setLocal] = useState<IStore>(INIT_STORE);

  const [localActiveKey, setLocalActiveKey] = useState<IStoreKey>('localStorage');
  const [pageActiveKey, setPageActiveKey] = useState<IStoreKey>('localStorage');

  // 切换暂存用户
  function switchCache() {
    setPage(local);
    // 仅仅替换localStorage
    mainLocalStorage.replace(local.localStorage);
    // mainSessionStorage.replace(local.sessionStorage);
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
      // mainCookie.getCurrent(),
      mainLocation.get(),
    ]).then((res) => {
      const [
        _localStorage,
        _sessionStorage,
        // _cookie,
        _location,
      ] = res.map((x) => x?.data || {});
      const iife =
        // 清空cookie
        '(() => {' +
        `window.location.href = "${_location.href || ''}";` +
        // // 清空cookie
        // '(function () {' +
        // 'const keys = document.cookie.match(/[^ =;]+(?==)/g) || [];' +
        // 'keys.forEach(key => {' +
        // 'document.cookie = key + "=0;expires=" + new Date(0).toUTCString();' +
        // '})' +
        // '})();' +
        // 当前替换localStorage
        `const o = ${JSON.stringify(_localStorage || {})};` +
        'localStorage.clear();' +
        'for (const k in o) {localStorage[k]=o[k]};' +
        // // 替换sessionStorage
        // `const s = ${JSON.stringify(_sessionStorage)};` +
        // 'sessionStorage.clear();' +
        // 'for (const k in s) {sessionStorage[k]=s[k]};' +
        // // 替换cookie
        // `const cookies = ${JSON.stringify(_cookie)};` +
        // 'const cookieKeys = Object.keys(cookies);' +
        // 'const cookieHelper = window.cookieStore || {' +
        // 'async set (cookie) {' +
        // 'document.cookie= `${cookie?.name || ""}=${cookie?.value || ""}`' +
        // '},' +
        // '};' +
        // 写入cookie
        // 'console.log("cookieKeys", cookieKeys);' +
        // 'cookieKeys.map(k => cookieHelper.set(cookies[k]));' +
        '})();';
      copyToClipboard(iife).then(() => {
        message.success('复制成功（粘贴到浏览器控制台运行 IIFE）', 1);
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
    Promise.all([mainLocalStorage.clear(), mainSessionStorage.clear(), mainCookie.clear()]).then(
      () => {
        setPage(INIT_STORE);
      },
    );
  }

  // 刷新主页面数据
  function refreshMain() {
    mainLocation.reload();
  }

  // 退出登录
  function exitLogin() {
    Promise.all([mainLocalStorage.clear(), mainSessionStorage.clear(), mainCookie.clear()]).then(
      () => {
        setPage(INIT_STORE);
        mainLocation.reload();
      },
    );
  }

  useEffect(() => {
    // 获取暂存
    chromeLocalStorage.get().then((local) => {
      setLocal(local);
      setLocalActiveKey('localStorage');
    });
  }, []);

  return (
    <LocaleProvider value={locale}>
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
            {/*<Button onClick={genAcrossDeviceUrl}>复制跨设备链接</Button>*/}
            <Button onClick={genIIFE}>{locale.COPY_IIFE}</Button>
            <Tooltip
              overlayInnerStyle={{ width: 380, padding: '12px 16px' }}
              title={
                <Space direction='vertical'>
                  <div>IIFE 注意事项：</div>
                  <div>* 复制到同源页面控制台执行时立即生效（推荐）</div>
                  <div>* 新标签页面控制台执行（需执行2次以覆盖本地数据）</div>
                  <div>* 禁止在其他页面执行（会覆盖其他页面本地数据）</div>
                </Space>
              }
            >
              <QuestionCircleOutlined style={{ cursor: 'pointer', color: '#c0c0c0' }} />
            </Tooltip>
          </Space>

          <Space size={12}>
            <Button type={'primary'} onClick={switchCache}>
              {locale.SWITCH}
            </Button>
            <Button type={'primary'} onClick={saveCache}>
              {locale.SAVE}
            </Button>
          </Space>
        </div>
        <Space style={{ width: '100%' }} direction={'vertical'}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space style={{ color: 'rgb(197, 197, 197)', fontSize: 12 }}>
              <span>{locale.TEMPORARY}</span>
              <SimpleTabs
                value={localActiveKey}
                onChange={setLocalActiveKey as any}
                options={[
                  { label: 'localStorage', value: 'localStorage' },
                  // { label: 'sessionStorage', value: 'sessionStorage' },
                  // { label: 'cookie', value: 'cookie' },
                ]}
              />
            </Space>
            <Space>
              <a onClick={clearCache}>{locale.CLEAR}</a>
            </Space>
          </div>
          <ObjectBlock
            style={{ height: 155, border: '1px solid #e8e8e8', overflowY: 'auto' }}
            data={local[localActiveKey]}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space style={{ color: 'rgb(197, 197, 197)', fontSize: 12 }}>
              <span>{locale.PAGE}</span>
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
              <a onClick={clearMain}>{locale.CLEAR}</a>
              <a onClick={refreshMain}>{locale.REFRESH}</a>
              <a onClick={exitLogin}>{locale.LOGOUT}</a>
            </Space>
          </div>
          <ObjectBlock
            loading={loading}
            style={{ height: 155, border: '1px solid #e8e8e8', overflowY: 'auto' }}
            data={page[pageActiveKey]}
          />
        </Space>

        {/* 底部配置项 */}
        {/*<Space style={{ marginTop: 8, fontSize: 12, color: '#676767', userSelect: 'none' }}>*/}
        {/*  <Dynamic type={'rotate'}>*/}
        {/*    <SettingOutlined style={{ cursor: 'pointer' }} />*/}
        {/*  </Dynamic>*/}
        {/*  <Dynamic type={'scale'}>*/}
        {/*    <span*/}
        {/*      style={{ cursor: 'pointer' }}*/}
        {/*      onClick={() => {*/}
        {/*        setLocaleType(localeType === 1 ? 2 : 1);*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      {localeType === 1 ? 'ZH' : 'EN'}*/}
        {/*    </span>*/}
        {/*  </Dynamic>*/}
        {/*</Space>*/}
      </div>
    </LocaleProvider>
  );
}
