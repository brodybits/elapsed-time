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
        // NOTE: At this point, puppeteer@1 must be installed *manually*
        // (`npm i --save-dev puppeteer@1`)
        // before testing with `ChromeHeadless`.
        // Rationale is to avoid breaking Travis CI testing on
        // DEPRECATED Node.js versions 0.12 & 4.
        if (process.env.TEST_BROWSER_CHROME_HEADLESS) {
          return ['ChromeHeadless']
        }

        var browsers = ['Chrome', 'Firefox']
        return browsers.filter(function (browser) {
          return availableBrowser.indexOf(browser) !== -1
        })
      }
    }
  })
}
