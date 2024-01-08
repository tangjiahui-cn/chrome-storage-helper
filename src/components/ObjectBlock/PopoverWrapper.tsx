import React from 'react';
import { message, Popover } from 'antd';
import { copyToClipboard } from '@/utils';
import { css } from 'class-css';

const popoverOverClass = css({
  '& .ant-popover-inner-content': {
    padding: 0,
    transition: 'all .3s',
    '&:hover': {
      background: 'rgba(0,0,0,0.03)',
    },
  },
});

const contentClass = css({
  width: 300,
  overflowX: 'hidden',
  height: 200,
  overflowY: 'auto',
  fontSize: '0.75rem',
  cursor: 'pointer',
  padding: '4px 8px',
});

interface IProps {
  title?: string;
  content?: string;
  children?: React.ReactNode;
}
export default function PopoverWrapper(props: IProps) {
  return (
    <Popover
      title={props?.title}
      overlayClassName={popoverOverClass}
      content={
        <div
          className={contentClass}
          onClick={() => {
            if (props?.content) {
              copyToClipboard(props.content as any).then(() => {
                message.success('复制成功');
              });
            }
          }}
        >
          {props?.content || (
            <span style={{ color: '#a2a2a2', userSelect: 'none', marginLeft: 8 }}>暂无数据</span>
          )}
        </div>
      }
      placement={'topLeft'}
      trigger={'click'}
    >
      {props?.children}
    </Popover>
  );
}
