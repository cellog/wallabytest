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
    compilers: {
      'app/imports/**/*.js': wallaby.compilers.babel({
        babel: load('babel-core'),
        presets: ['es2015', 'stage-2', 'react']
      })
    },
    env: {
      type: 'node'
    },
    testFramework: 'mocha',
    debug: true
  };
};