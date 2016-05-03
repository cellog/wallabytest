module.exports = function (wallaby) {
  const load = require
  return {
    files: [
      { pattern: 'app/imports/**/*.test.js', ignore: true },
      { pattern: 'app/imports/testing/npm-require.js', instrument: false },
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
//      const n = require(`${w.localProjectDir}app/.meteor/local/build/programs/server/npm-require.js`)
      const n = require('app/imports/testing/npm-require.js')
      global.getMeteorApp = (file) => {
        //console.log(n.resolve(`meteor/${file}`))
      }
    },
    testFramework: 'mocha',
    debug: true
  };
};