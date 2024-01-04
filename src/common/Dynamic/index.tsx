/**
 * 给包裹内容添加动效
 *
 * At 2023/12/15
 * By TangJiaHui
 */
import React, { useMemo } from 'react';
import { css } from 'class-css';

type IProps = {
  type?: 'none' | 'rotate' | 'scale'; // 动效类型
  delay?: number; // 动画延时（ms）
  scale?: number; // scale 下的倍率
  rotate?: number; // rotate 下的旋转角度
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export default function Dynamic(props: IProps) {
  const className = useMemo(() => {
    switch (props?.type) {
      case 'rotate':
        const { delay: rotateDelay = 500, rotate = 180 } = props;
        return css({
          transition: `transform ${rotateDelay}ms`,
          '&:hover': {
            transform: `rotate(${rotate}deg)`,
          },
        });
      case 'scale':
        const { delay: scaleDelay = 300, scale = 1.25 } = props;
        return css({
          transition: `transform ${scaleDelay}ms`,
          '&:hover': {
            transform: `scale(${scale})`,
          },
        });
      case 'none':
      default:
        return '';
    }
  }, [props]);

  return (
    <div
      className={className}
      style={{ display: 'inline-table', height: 18, lineHeight: '18px', ...props?.style }}
    >
      {props?.children}
    </div>
  );
}
