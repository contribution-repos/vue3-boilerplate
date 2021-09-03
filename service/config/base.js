import webpack from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import eslintFormatterFriendly from 'eslint-formatter-friendly'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import HTMLPlugin from 'html-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'

import resolveClientEnv from '../utils/resolveClientEnv.js'
import * as paths from '../utils/paths.js'

import config from '../project.config.js'

const { DefinePlugin } = webpack

const isProd = process.env.NODE_ENV === 'production'
const outputFileName = `js/[name]${isProd ? '.[contenthash:8]' : ''}.js`

export default {
  context: process.cwd(),

  entry: {
    app: './src/main',
  },

  output: {
    path: paths.resolve(config.outputDir),
    publicPath: config.dev.publicPath,
    filename: outputFileName,
    chunkFilename: outputFileName,
  },

  resolve: {
    alias: {
      '@': paths.resolve('src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
  },

  plugins: [
    new ESLintPlugin({
      emitError: true,
      emitWarning: true,
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
      formatter: eslintFormatterFriendly(),
    }),
    new VueLoaderPlugin(),
    new CaseSensitivePathsPlugin(),
    new HTMLPlugin({
      template: paths.resolve('public/index.html'),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: paths.resolve('public'),
          toType: 'dir',
          globOptions: {
            ignore: ['.DS_Store', '**/index.html'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
    new DefinePlugin({
      // vue3 feature flags <http://link.vuejs.org/feature-flags>
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',

      ...resolveClientEnv({ publicPath: config.dev.publicPath }),
    }),
  ],

  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,

    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },

      // babel
      {
        test: /\.m?jsx?$/,
        exclude: (file) => {
          // always transpile js in vue files
          if (/\.vue\.jsx?$/.test(file)) {
            return false
          }
          // Don't transpile node_modules
          return /node_modules/.test(file)
        },
        use: ['thread-loader', 'babel-loader'],
      },

      // ts
      {
        test: /\.tsx?$/,
        use: [
          'thread-loader',
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: ['\\.vue$'],
              happyPackMode: true,
            },
          },
        ],
      },

      // images
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        type: 'asset',
        generator: { filename: 'img/[contenthash:8][ext][query]' },
      },

      // do not base64-inline SVGs.
      // https://github.com/facebookincubator/create-react-app/pull/1180
      {
        test: /\.(svg)(\?.*)?$/,
        type: 'asset/resource',
        generator: { filename: 'img/[contenthash:8][ext][query]' },
      },

      // media
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset',
        generator: { filename: 'media/[contenthash:8][ext][query]' },
      },

      // fonts
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset',
        generator: { filename: 'fonts/[contenthash:8][ext][query]' },
      },
    ],
  },
}
