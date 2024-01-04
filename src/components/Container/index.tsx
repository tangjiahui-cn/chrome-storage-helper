import React from 'react';

interface Props {
  width?: number | string;
  height?: number;
  children?: React.ReactNode;
}
export default function Container(props: Props) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: props?.width || 'auto',
        height: props?.height || 'auto',
        overflow: 'hidden',
        border: __DEV__ ? '1px solid black' : undefined,
        background: 'whitesmoke',
        userSelect: 'none',
      }}
    >
      {props?.children}
    </div>
  );
}
