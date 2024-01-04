import React from 'react';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { css } from 'class-css';
import { TooltipPlacement } from 'antd/lib/tooltip';

const activeClass = css({
  color: '#3499ee',
});

interface IconWrapperProps {
  title?: React.ReactNode;
  placement?: TooltipPlacement;
  isActive?: boolean; // 是否选中
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler;
  style?: React.CSSProperties;
}

export default function IconWrapper(props: IconWrapperProps) {
  return (
    <Tooltip title={props?.title} placement={props?.placement}>
      <div
        style={{ cursor: 'pointer', ...props?.style }}
        className={classNames(props?.isActive && activeClass)}
        onClick={props?.onClick}
      >
        {props?.children}
      </div>
    </Tooltip>
  );
}
