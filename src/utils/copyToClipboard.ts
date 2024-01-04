import { popup } from '@/data';

export async function copyToClipboard(data: string) {
  return popup.sendContent({
    type: 'system',
    data: {
      opt: 'copyToClipboard',
      data,
    },
  });
}
