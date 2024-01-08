import { createContext, useContext } from 'react';
import zh_CN from '@/locales/zh-CN';

export interface Locale {
  SWITCH: string; // 切换
  SAVE: string; // 保存
  COPY_IIFE: string; // 复制IIFE
  CLEAR: string; // 清空
  REFRESH: string; // 刷新
  LOGOUT: string; // 登出

  TEMPORARY: string; // 暂存
  PAGE: string; // 页面

  NO_DATA: string; // 暂无数据
}

export { default as zh_CN } from './zh-CN';
export { default as en_US } from './en-US';

const context = createContext<Locale>(zh_CN);
export const LocaleProvider = context.Provider;
export const useLocale = () => useContext(context);
