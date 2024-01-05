import { Button, Checkbox, message, Space } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import ObjectBlock from '@/components/ObjectBlock';
import { mainLocalStorage, chromeLocalStorage, mainLocation } from '@/proxy';
import { copyToClipboard, pick } from '@/utils';
import { generateAcrossDeviceUrl } from '@/data';
import { SettingOutlined } from '@ant-design/icons';
import { css } from 'class-css';

export default function () {
  const [localData, setLocalData] = useState<any>({});
  const [localSelectKeys, setLocalSelectKeys] = useState<string[]>([]);
  const [pageData, setPageData] = useState<any>({});

  const isCache = useMemo(() => !!Object.keys(localData).length, [localData]);
  const isSelectAll = useMemo(
    () => localSelectKeys.length === Object.keys(localData).length,
    [localSelectKeys, localData],
  );

  // 切换暂存用户
  function switchCache() {
    const data = pick(localData, localSelectKeys);
    setPageData(data);
    mainLocalStorage.replace(data);
  }

  // 保存到暂存用户
  function saveCache() {
    chromeLocalStorage.save(pageData).then(() => {
      chromeLocalStorage.get().then((localStorage) => {
        setLocalData(localStorage);
        setLocalSelectKeys(Object.keys(localStorage));
      });
    });
  }

  // 生成跨设备链接
  function genAcrossDeviceUrl() {
    mainLocation.get().then(({ data: _mainLocation }) => {
      // 压缩到2000个字符串长度
      const url = generateAcrossDeviceUrl(_mainLocation.href, pageData);
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
    mainLocalStorage.getCurrent().then(({ data: _mainLocalStorage }) => {
      mainLocation.get().then(({ data: _mainLocation }) => {
        const iife =
          '(() => {' +
          `const o = ${JSON.stringify(_mainLocalStorage || {})};` +
          'localStorage.clear();' +
          'for (const k in o) {localStorage[k]=o[k]};' +
          `window.location.href = "${_mainLocation.href || ''}"` +
          '})()';
        copyToClipboard(iife).then(() => {
          message.success('复制成功（打开浏览器控制台运行iife）', 1);
        });
      });
    });
  }

  // 清空暂存
  function clearCache() {
    chromeLocalStorage.clear().then(() => {
      chromeLocalStorage.get().then((localStorage) => {
        setLocalData(localStorage);
        setLocalSelectKeys(Object.keys(localStorage));
      });
    });
  }

  // 清空主页面数据
  function clearMain() {
    mainLocalStorage.clear().then(() => {
      mainLocalStorage.getCurrent().then((res) => {
        if (res?.success) {
          setPageData(res?.data);
        }
      });
    });
  }

  // 退出登录
  function exitLogin() {
    mainLocalStorage.clear().then(() => {
      mainLocalStorage.getCurrent().then((res) => {
        if (res?.success) {
          setPageData(res?.data);
          mainLocation.reload();
        }
      });
    });
  }

  useEffect(() => {
    // 获取暂存
    chromeLocalStorage.get().then((localStorage) => {
      setLocalData(localStorage);
      setLocalSelectKeys(Object.keys(localStorage));
    });

    // 获取页面
    setTimeout(() => {
      mainLocalStorage.getCurrent().then((res) => {
        if (res?.success) {
          setPageData(res.data);
        }
      });
    }, 10);
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
          <span style={{ color: 'rgb(197, 197, 197)', fontSize: 12 }}>暂存 localStorage</span>
          <Space>
            {isCache && (
              <a onClick={() => setLocalSelectKeys(isSelectAll ? [] : Object.keys(localData))}>
                {isSelectAll ? '反选' : '全选'}
              </a>
            )}
            <a onClick={clearCache}>清空</a>
          </Space>
        </div>
        <ObjectBlock
          style={{ height: 155, border: '1px solid #e8e8e8', overflowY: 'auto' }}
          data={localData}
          selectable
          selectKeys={localSelectKeys}
          onSelect={setLocalSelectKeys}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgb(197, 197, 197)', fontSize: 12 }}>页面 localStorage</span>
          <Space>
            <a onClick={clearMain}>清空</a>
            <a onClick={exitLogin}>登出</a>
          </Space>
        </div>
        <ObjectBlock
          style={{ height: 155, border: '1px solid #e8e8e8', overflowY: 'auto' }}
          data={pageData}
        />
      </Space>
    </div>
  );
}
