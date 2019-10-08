module.exports = function (config) {
  config.set({
    browsers: ['ChromeHeadless'],
    frameworks: ['browserify', 'mocha'],
    files: [
      'node_modules/babel-polyfill/browser.js',
      'test/*.js'
    ],
    preprocessors: {
      'test/*.js': ['browserify']
    },
    singleRun: true,
    plugins: [
      'karma-browserify',
      'karma-chrome-launcher',
      'karma-mocha'
    ],
    browserify: {
      debug: true,
      transform: [
        ['babelify']
      ]
    }
  })
}
