module.exports = function (wallaby) {
  const load = require
  return {
    files: [
      { pattern: 'app/imports/**/*.test.js', ignore: true },
      'app/imports/api/stuff.js'
    ],
    tests: [
      'app/imports/**/*.test.js'
    ],
    preprocessors: {
      '**/*.js': file => {
        return file.content.replace("require('meteor/", "getMeteorApp('")
      }
    },
    compilers: {
      'app/imports/**/*.js': wallaby.compilers.babel({
        babel: load('babel-core'),
        presets: ['es2015', 'stage-2', 'react']
      })
    },
    env: {
      type: 'node'
    },
    setup: function(w) {
      global.getMeteorApp = (file) => {
        global.Package = {
          'underscore': require(`${w.localProjectDir}app/.meteor/local/build/programs/server/packages/underscore.js`)
        }
        return require(`${w.localProjectDir}app/.meteor/local/build/programs/server/packages/${file}.js`)
      }
    },
    testFramework: 'mocha',
    debug: true
  };
};