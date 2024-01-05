import { pick, stringify, unStringify } from '@/utils';
import { unZip, zip } from '@/utils';

/**
 * 解析跨设备链接
 *
 * At 2024/1/4
 * By TangJiaHui
 */
const ACROSS_DEVICE = '__CSH__=';
const KEYS = [
  'href',
  'hash',
  'host',
  'hostname',
  'href',
  'origin',
  'pathname',
  'port',
  'protocol',
  'search',
];

// 从href中获取参数、源地址
function loadHref(href: string) {
  const sliceIndex: number = href?.indexOf('?');
  let origin: string = href;
  let pairs: string[] = [];

  if (sliceIndex > -1) {
    const pairsStr = href.slice(sliceIndex + 1);
    origin = href.slice(0, sliceIndex);
    pairs = pairsStr?.length ? pairsStr.split('&') : [];
  }

  return {
    origin,
    pairs,
  };
}

// 解析href
function parseHref(href: string) {
  let { origin, pairs } = loadHref(href);
  let content: string = '';

  pairs = pairs.filter((pair) => {
    const isCSH = pair.includes(ACROSS_DEVICE);
    if (isCSH) {
      content = decodeURIComponent(pair?.slice(ACROSS_DEVICE?.length) || '');
    }
    return !isCSH;
  });

  if (pairs.length) {
    origin += `?${pairs.join('&')}`;
  }

  return {
    content,
    pureHref: origin,
  };
}

// 解析跨设备url
// 过程：跨设备url -> 解压缩 -> 取消stringify -> 数据
export function parser() {
  const snapshotLocation = pick(window.location as any, KEYS);
  const isAcrossDevice = snapshotLocation.href?.includes(ACROSS_DEVICE); // 是否跨设备
  console.log('是否跨设备： ', `【${isAcrossDevice ? '是' : '否'}】`, snapshotLocation.href);
  if (isAcrossDevice) {
    const { content, pureHref } = parseHref(snapshotLocation.href);
    const decodeContent = unZip(content);
    const target = unStringify(decodeContent);
    replaceLocalStorage(target);
    location.href = pureHref;
  }
}

// 生成跨设备URL
// 过程：数据 -> stringify -> 压缩 -> 跨设备url
export function generateAcrossDeviceUrl(href: string, localStorage: IObject = {}) {
  const content = stringify(localStorage);
  const encodeContent = zip(content);
  const full = ACROSS_DEVICE + encodeContent;
  const { origin, pairs } = loadHref(href);
  const url = `${origin}?${[...pairs, full].join('&')}`;
  return url;
}

function replaceLocalStorage(target: IObject) {
  localStorage.clear();
  Object.keys(target).forEach((k) => {
    localStorage.setItem(k, target[k]);
  });
}
