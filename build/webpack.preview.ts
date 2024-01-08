/**
 * preview
 *
 * At 2024/1/8
 * By TangJiaHui
 */
import { merge } from 'webpack-merge';
import { Configuration } from 'webpack';
import common from './webpack.common';

export default merge(common, {
  optimization: {
    minimize: false,
  },
} as Configuration);
