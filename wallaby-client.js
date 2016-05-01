'use strict'

module.exports = function (wallaby) {
  const babel = require('babel-core')
  const path = require('path')
  const wallabyWebpack = require('wallaby-webpack')

  const webpackConfig = {
    resolve: {
      root: path.join(wallaby.projectCacheDir, 'app/node_modules', 'app', 'app/imports'),
      extensions: ['', '.js', '.jsx', '.json'],
      modulesDirectories: ['app/node_modules']
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
    'app/.meteor/local/build/programs/web.browser/merged-stylesheets.css',
    'app/imports/testing/runtime-config.js'
  ].concat(appManifest
    .filter(function (file) {
      return file.type === 'js' && file.path.startsWith('packages/')
    })
    .map(function (file) {
      return { pattern: path.join(basePath, file.path), load: true }
    })
    .concat([
      { pattern: 'app/imports/**/*.test.*', ignore: true },
      { pattern: 'app/imports/startup/**/*.jsx', load: false },
      { pattern: 'app/imports/startup/**/*.js', load: false },
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
