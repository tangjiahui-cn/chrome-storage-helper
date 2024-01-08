import React, { useMemo } from 'react';
import { Checkbox, Empty, Spin } from 'antd';
import { css } from 'class-css';
import PopoverWrapper from './PopoverWrapper';
import classNames from 'classnames';
import { useLocale } from '@/locales';
import { isObject } from 'lodash';

const itemClass = css({
  width: '50%',
  display: 'inline-flex',
  overflow: 'hidden',
  cursor: 'pointer',
  fontSize: 12,
  gap: 4,
});

const itemHoverClass = css({
  userSelect: 'none',
  '&:hover': {
    background: 'whitesmoke',
  },
});

export interface ObjectBlockProps {
  data?: {
    [K: string]: string;
  };
  loading?: boolean;
  selectKeys?: string[];
  selectable?: boolean; // 是否可以选中
  style?: React.CSSProperties;
  onSelect?: (keys: string[]) => void;
}

export default function ObjectBlock(props: ObjectBlockProps) {
  const locale = useLocale();

  const items = useMemo(() => {
    return Object.keys(props?.data || {}).map((k) => {
      return {
        label: k,
        value: k,
      };
    });
  }, [props?.data]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: '8px 12px',
        ...props?.style,
      }}
    >
      {items?.length ? (
        items.map((x) => {
          const checked = props?.selectKeys?.includes(x?.value);
          const objectKey = x?.value;
          const value = props?.data?.[x?.value];
          const objectValue = isObject(value) ? JSON.stringify(value) : value;
          return (
            <div
              key={x?.value}
              className={classNames(itemClass, itemHoverClass)}
              onClick={() => {
                if (!props?.selectable) return;
                props?.onSelect?.(
                  checked
                    ? props?.selectKeys?.filter((k) => k !== x?.value) || []
                    : [...(props?.selectKeys || []), x?.value],
                );
              }}
            >
              {props?.selectable && <Checkbox checked={checked} />}
              <PopoverWrapper title={objectKey} content={objectValue}>
                <div
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {x?.label}
                </div>
              </PopoverWrapper>
            </div>
          );
        })
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={locale.NO_DATA} />
      )}

      {/* 加载中 */}
      {props?.loading && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.7)',
          }}
        >
          <Spin spinning />
        </div>
      )}
    </div>
  );
}
