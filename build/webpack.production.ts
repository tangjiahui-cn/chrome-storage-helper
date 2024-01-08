/**
 * production
 *
 * At 2024/1/8
 * By TangJiaHui
 */
import { merge } from 'webpack-merge';
import { Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import common from './webpack.common';

export default merge(common, {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
} as Configuration);
