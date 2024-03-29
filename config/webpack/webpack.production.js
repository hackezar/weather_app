// @ts-check
import { merge } from 'webpack-merge'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import webpackConfiguration from '../../webpack.config.js'

const isCi = process.env.CI

/**
 * Webpack config for Production
 *
 * @type {import('webpack').Configuration}
 */
const productionConfig = {
  mode: 'production',
  performance: {
    maxEntrypointSize: 512_000,
    maxAssetSize: 512_000,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: isCi ? 'static' : 'server',
      reportFilename: '../bundle-report.html', // (to project root dir) relative to a bundle output directory
    }),
  ],
}

export default merge(webpackConfiguration, productionConfig)
