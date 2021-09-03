import loadEnv from '../utils/loadEnv.js'
loadEnv()
loadEnv('production')

import rm from 'rimraf'
import webpack from 'webpack'

import { error, done } from '../utils/logger.js'
import { logWithSpinner, stopSpinner } from '../utils/spinner.js'
import * as paths from '../utils/paths.js'

import webpackConfig from '../config/prod.js'
import config from '../project.config.js'

logWithSpinner('Building for production...')

rm(paths.resolve(config.outputDir), (err) => {
  if (err) throw err

  webpack(webpackConfig, (err, stats) => {
    stopSpinner(false)

    if (err) throw err

    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
      }) + '\n\n'
    )

    if (stats.hasErrors()) {
      error('Build failed with errors.\n')
      process.exit(1)
    }

    done('Build complete.\n')
  })
})
