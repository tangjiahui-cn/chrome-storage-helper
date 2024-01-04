import { Button, Checkbox, Space } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import ObjectBlock from '@/components/ObjectBlock';
import { mainLocalStorage, chromeLocalStorage } from '@/proxy';
import { pick } from '@/utils';

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
    <div style={{ width: 450, padding: '12px 16px' }}>
      <Space size={16} style={{ marginBottom: 16 }}>
        <Button type={'primary'} onClick={switchCache}>
          切换
        </Button>
        <Button type={'primary'} onClick={saveCache}>
          保存
        </Button>
      </Space>
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
          style={{ height: 130, border: '1px solid #e8e8e8', overflowY: 'auto' }}
          data={localData}
          selectable
          selectKeys={localSelectKeys}
          onSelect={setLocalSelectKeys}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgb(197, 197, 197)', fontSize: 12 }}>页面 localStorage</span>
          <Space>
            <a onClick={clearMain}>清空</a>
          </Space>
        </div>
        <ObjectBlock
          style={{ height: 130, border: '1px solid #e8e8e8', overflowY: 'auto' }}
          data={pageData}
        />
      </Space>
    </div>
  );
}
