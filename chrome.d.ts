interface Window {
  cookieStore: CookieStore;
}

declare interface IStore {
  localStorage: IObject;
  sessionStorage: IObject;
  cookie: IObject;
}

declare type IStoreKey = keyof IStore;

declare interface CookieStore {
  get: (name: string) => Promise<Cookie>;
  getAll: () => Promise<Cookie[]>;
  set: (cookie: Cookie) => Promise<void>;
  delete: (name: string) => Promise<void>;
}

declare interface Cookie {
  name: string;
  value: string;
  domain?: any;
  expires?: number;
  partitioned?: boolean;
  path?: string;
  sameSite?: string;
  secure?: boolean;
}

declare interface CookieStorage {
  [K: string]: Cookie;
}

declare interface SqlData {
  // 保存登录数据格式
  key: string;
  // 标题
  title?: string;
  // 元数据
  meta: {
    origin: string; // 网页origin
    href: string; // 网页href
    title: string; // 网页标题
  };
  data: {
    localStorage: {
      [K: string]: any;
    };
    sessionStorage: {
      [K: string]: any;
    };
  };
}

declare type ResponseData<T = any> = {
  success?: boolean; // 是否成功
  errorMsg?: string; // 报错数据
  data?: T; // 返回数据
};

declare type Sender = {
  id: string;
  origin: string;
};

declare type SendDataFrom = 'popup' | 'background' | 'content';
declare type SendDataPayload = {
  type: 'cookieStorage' | 'system' | 'sessionStorage' | 'localStorage' | 'location' | string; // 处理的数据类型（与注册插件id绑定）
  data?: any;
};
declare type SendData = {
  id: string; // 每次请求id
  from: SendDataFrom;
  payload: SendDataPayload;
};

declare type SendResponse = (data: ResponseData) => void;
declare type RuntimeOnMessageCallback = (
  request: SendData,
  sender?: Sender,
  sendResponse?: SendResponse,
) => void;
declare type RuntimeOnMessage = {
  addListener: (callback?: RuntimeOnMessageCallback) => void;
};

type TabQuery = (
  options: {
    active: boolean;
    currentWindow: boolean;
  },
  callback: (tabs: any[]) => void,
) => void;

type TabSendMessage = (
  tabId: number,
  data: SendData,
  receiveCallback?: (data: ResponseData) => void,
) => void;

declare type IObject<T = any> = {
  [K: string]: IObject | string | number | null | undefined | T;
};
declare const chrome: {
  runtime: {
    sendMessage: (payload: SendData, callback?: (res: any) => void) => void;
    onMessage: RuntimeOnMessage;
  };
  tabs: {
    query: TabQuery;
    sendMessage: TabSendMessage;
  };
  storage: {
    local: {
      set: (data: IObject) => Promise<void>;
      get: (key?: string) => Promise<IObject>;
      remove: (key: string | string[]) => Promise<void>;
      clear: () => Promise<void>;
    };
  };
};
