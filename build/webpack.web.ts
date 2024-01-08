/**
 * preview
 *
 * At 2024/1/8
 * By TangJiaHui
 */
import { merge } from 'webpack-merge';
import { Configuration } from 'webpack';
import preview from './webpack.preview';

export default merge(preview, {
  devServer: {
    port: 9988,
    open: true,
    hot: true,
  },
} as Configuration);
