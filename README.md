# chrome-storage-helper

帮助在不同的chrome页之间切换localStorage数据

## 如何安装

```js
1、打开 chrome浏览器 页面的 chrome extension 页面
2、打开开发者模式
3、将 chrome-storage-helper 文件夹拖进 chrome extension 页面即可
```

## 支持功能

```
1、保存当前页localStorage
2、加载存储localStorage到当前页
3、全选/反选 选择加载的项
4、tabs页之间同步选中状态
5、IIFE跨浏览器恢复登录用户页面
6、跨设备链接（一个地址访问恢复登录用户状态）【有点BUG】
```
## 本地开发
```shell
# 开发chrome扩展（如果修改content，则需要刷新插件）
pnpm dev

# 查看UI
pnpm dev:web

# 构建产物
pnpm build
```
