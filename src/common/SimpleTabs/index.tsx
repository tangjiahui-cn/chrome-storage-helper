/**
 * 简单tabs
 *
 * At 2024/1/5
 * By TangJiaHui
 */
import { Space } from 'antd';
import { css } from 'class-css';
import classNames from 'classnames';

const itemClass = css({
  cursor: 'pointer',
  color: 'rgb(197, 197, 197)',
  transition: 'all .3s',
});

const itemChooseClass = css({
  color: 'rgba(0,0,0,0.85)',
});

export type SimpleTabsProps = {
  options?: {
    label: string;
    value: string;
  }[];
  value?: string;
  onChange?: (value: string) => void;
};

export default function SimpleTabs(props: SimpleTabsProps) {
  return (
    <Space>
      {props?.options?.map((x, index) => {
        const isNotLast = index !== (props?.options?.length || 0) - 1;
        return (
          <>
            <span
              key={x?.value}
              onClick={() => props?.onChange?.(x?.value)}
              className={classNames(itemClass, props?.value === x.value && itemChooseClass)}
            >
              {x?.label}
            </span>
            {isNotLast && <span key={x?.value + '/'}>/</span>}
          </>
        );
      })}
    </Space>
  );
}
