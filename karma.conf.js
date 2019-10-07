module.exports = function (config) {
  config.set({
    frameworks: ['browserify', 'detectBrowsers', 'mocha'],
    files: [
      'node_modules/babel-core/browser-polyfill.js',
      'test/*.js'
    ],
    preprocessors: {
      'test/*.js': ['browserify']
    },
    singleRun: true,
    plugins: [
      'karma-browserify',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-detect-browsers',
      'karma-mocha'
    ],
    browserify: {
      debug: true,
      transform: [
        ['babelify']
      ]
    },
    detectBrowsers: {
      enabled: true,
      usePhantomJS: false,
      postDetection: function (availableBrowser) {
        return ['ChromeHeadless']
      }
    }
  })
}
