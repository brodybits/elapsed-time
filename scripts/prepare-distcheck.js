const childProc = require('child_process')

const fs = require('fs')

const copydir = require('copy-dir')

const DISTCHECK_ROOT = 'distcheck'

const DISTCHECK_BROWSER_ROOT = `${DISTCHECK_ROOT}/browser`

const DISTCHECK_NODE_ROOT = `${DISTCHECK_ROOT}/node`

// I/O wrapper functions with logging:

const ensureDirSync = (dir) => {
  console.log(`* create directory ${dir}`)
  // FUTURE TBD use `ensureDirSync` from `fs-extra`
  // (once we drop support for some extra-old Node.js versions)
  fs.mkdirSync(dir, { recursive: true })
}

// FUTURE TBD simply use `copySync` from `fs-extra`
// (once we drop support for some extra-old Node.js versions)

const copyDirSync = (src, dest) => {
  console.log(`* copy artifacts directory from ${src} to ${dest}`)
  copydir.sync(src, dest)
}

const copyFileSync = (src, dest) => {
  console.log(`* copy file artifact from ${src} to ${dest}`)
  fs.copyFileSync(src, dest)
}

const commandSync = (c, o) => {
  console.log(`* in ${o.cwd} execute command: ${c}`)
  // FUTURE TBD change to use `commandSync` from `execa`
  // (once we drop support for some extra-old Node.js versions)
  childProc.execSync(c, o)
}

// This step is done by calling rimraf in `distcheck:prepare` script:
// removeSync(DISTCHECK_ROOT)

ensureDirSync(DISTCHECK_BROWSER_ROOT)

copyDirSync('lib', `${DISTCHECK_BROWSER_ROOT}/src`)
copyFileSync('lib/hrtime-browser.js', `${DISTCHECK_BROWSER_ROOT}/src/hrtime.js`)
copyDirSync('test', `${DISTCHECK_BROWSER_ROOT}/test`)
copyFileSync('karma.conf.js', `${DISTCHECK_BROWSER_ROOT}/karma.conf.js`)

commandSync('npm init -y', {
  cwd: `${DISTCHECK_BROWSER_ROOT}`,
  stdio: 'inherit'
})

commandSync(`npm install babel-runtime@${require('../package.json').dependencies['babel-runtime']}`, {
  cwd: `${DISTCHECK_BROWSER_ROOT}`,
  stdio: 'inherit'
})

commandSync(`npm install babel-core@${require('../package.json').devDependencies['babel-core']}`, {
  cwd: `${DISTCHECK_BROWSER_ROOT}`,
  stdio: 'inherit'
})

ensureDirSync(DISTCHECK_NODE_ROOT)
copyDirSync('lib', `${DISTCHECK_NODE_ROOT}/src`)
copyDirSync('test', `${DISTCHECK_NODE_ROOT}/test`)
