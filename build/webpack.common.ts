import * as path from 'path';
import { ProvidePlugin, DefinePlugin, Configuration } from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import pkg from '../package.json';
import 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
export const root = (...args: any) => path.resolve(__dirname, '../', ...args);

// 是否开发环境
const __DEV__ = process.env.mode === 'development';
const __PREVIEW__ = process.env.mode === 'preview';
const __PRODUCTION__ = process.env.mode === 'production';
// 打包目录
const BUILD_DIR = root(pkg.name + (__PRODUCTION__ ? '' : '-dev'));

export default {
  mode: 'production',
  entry: {
    popup: root('./src/popup.ts'),
    content: root('./src/content.ts'),
    background: root('./src/background.ts'),
  },
  output: {
    clean: true,
    path: BUILD_DIR,
    filename: '[name].js',
  },
  cache: {
    type: 'memory',
  },
  performance: {
    hints: false,
  },
  resolve: {
    alias: {
      '@': root('./src'),
    },
    extensions: ['.ts', '.tsx', '...'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[local]-[hash:8]',
              },
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: root('./index.html'),
      chunks: ['popup'],
    }),
    new ProvidePlugin({
      React: 'react',
    }),
    new DefinePlugin({
      __DEV__,
      __PREVIEW__,
      __PRODUCTION__,
    }),
    new CopyPlugin({
      patterns: [{ from: root('./public'), to: BUILD_DIR, toType: 'dir' }],
    }),
  ],
} as Configuration;
