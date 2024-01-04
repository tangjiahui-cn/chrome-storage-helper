import * as path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { ProvidePlugin, DefinePlugin, Configuration } from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import pkg from '../package.json';
import 'webpack-dev-server';
const root = (...args: any) => path.resolve(__dirname, '../', ...args);

// 是否开发环境
const __DEV__ = process.env.mode === 'development';
// 打包目录
const BUILD_DIR = root(pkg.name);

module.exports = {
  mode: __DEV__ ? 'development' : 'production',
  devtool: __DEV__ ? 'source-map' : undefined,
  entry: {
    popup: root('./src/index.tsx'),
    content: root('./src/content.ts'),
    background: root('./src/background.ts'),
  },
  output: {
    clean: true,
    path: BUILD_DIR,
    filename: '[name].js',
  },
  devServer: {
    port: 9988,
    open: true,
    hot: true,
  },
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
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
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
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
        test: /\.(ts|tsx)$/,
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
    }),
    new CopyPlugin({
      patterns: [{ from: root('./public'), to: BUILD_DIR, toType: 'dir' }],
    }),
  ],
} as Configuration;
