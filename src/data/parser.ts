import { pick } from '@/utils';
import Location from '@/content-plugin/location';

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
  let origin: string = href.slice(0, sliceIndex);
  let pairs: string[] = href.slice(sliceIndex + 1).split('&');

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

export function parser() {
  const snapshotLocation = pick(window.location as any, KEYS);
  const isAcrossDevice = snapshotLocation.href?.includes(ACROSS_DEVICE); // 是否跨设备
  // console.log('是否跨设备： ', `【${isAcrossDevice ? '是' : '否'}】`, snapshotLocation.href);
  if (isAcrossDevice) {
    const { content, pureHref } = parseHref(snapshotLocation.href);
    const target = JSON.parse(content);
    replaceLocalStorage(target);
    location.href = pureHref;
  }
}

function replaceLocalStorage(target: IObject) {
  localStorage.clear();
  Object.keys(target).forEach((k) => {
    localStorage.setItem(k, target[k]);
  });
}

// 生成跨设备URL
export function generateAcrossDeviceUrl(href: string, localStorage: IObject = {}) {
  const content = JSON.stringify(localStorage);
  const encodeContent = decodeURIComponent(content);
  const full = ACROSS_DEVICE + encodeContent;
  const { origin, pairs } = loadHref(href);
  return `${origin}?${[...pairs, full].join('&')}`;
}
