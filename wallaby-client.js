'use strict'

module.exports = function (wallaby) {
  const babel = require('babel-core')
  const path = require('path')
  const wallabyWebpack = require('wallaby-webpack')

  const webpackConfig = {
    resolve: {
      root: path.join(wallaby.projectCacheDir, 'app', 'imports'),
      extensions: ['', '.js', '.jsx', '.json'],
    },
    module: {
      loaders: [
        // JavaScript is handled by the Wallaby Babel compiler
        { test: /\.json$/, loader: 'json-loader' }
      ]
    }
  }

  const wallabyPostprocessor = wallabyWebpack(webpackConfig)

  const babelCompiler = wallaby.compilers.babel({
    babel,
    presets: ['react', 'es2015', 'stage-2'],
    //plugins: ['transform-decorators-legacy']
  })

  const appManifest = require(
    path.resolve('app/.meteor/local/build/programs/web.browser/program.json')).manifest
  const basePath = 'app/.meteor/local/build/programs/web.browser'
  const meteorPackageFiles = [
    { pattern: 'app/.meteor/local/build/programs/web.browser/merged-stylesheets.css', instrument: false },
    { pattern: 'app/imports/testing/runtime-config.js', instrument: false }
  ].concat(appManifest
    .filter(function (file) {
      return file.type === 'js' && file.path.startsWith('packages/')
    })
    .map(function (file) {
      return { pattern: path.join(basePath, file.path), load: true, instrument: false }
    })
    .concat([
      { pattern: 'app/imports/**/*.test.*', ignore: true },
      { pattern: 'app/imports/api/**/*.jsx', load: false },
      { pattern: 'app/imports/api/**/*.js', load: false },
    ]))

  return {
    files: meteorPackageFiles,
    tests: [
      { pattern: 'app/imports/**/*.test.*', load: false }
    ],
    env: {
      type: 'browser'
    },
    testFramework: 'mocha',

    compilers: {
      'app/**/*.js': babelCompiler,
      'app/**/*.jsx': babelCompiler
    },

    postprocessor: wallabyPostprocessor,

    setup: () => {
      // required to trigger test loading
      window.__moduleBundler.loadTests()
    },
    debug: true
  }
}
