import React, { useMemo } from 'react';
import { Checkbox, Empty } from 'antd';
import { css } from 'class-css';
import classNames from 'classnames';

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
  selectKeys?: string[];
  selectable?: boolean; // 是否可以选中
  style?: React.CSSProperties;
  onSelect?: (keys: string[]) => void;
}

export default function ObjectBlock(props: ObjectBlockProps) {
  const items = useMemo(() => {
    return Object.keys(props?.data || {}).map((k) => {
      return {
        label: k,
        value: k,
      };
    });
  }, [props?.data]);

  return (
    <div style={{ width: '100%', height: '100%', padding: '8px 12px', ...props?.style }}>
      {items?.length ? (
        items.map((x) => {
          const checked = props?.selectKeys?.includes(x?.value);
          return (
            <div
              key={x?.value}
              className={classNames(itemClass, props?.selectable && itemHoverClass)}
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
            </div>
          );
        })
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
}
