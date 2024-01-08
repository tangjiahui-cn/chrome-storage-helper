declare const __DEV__: boolean;
declare const __PREVIEW__: boolean;

declare module '*.json' {
  const object: {
    [k: string]: any;
  };
  export default object;
}

declare module '*.css' {
  const url: string;
  export default url;
}

declare module '*.less' {
  const classes: {
    [k: string]: string;
  };
  export default classes;
}
