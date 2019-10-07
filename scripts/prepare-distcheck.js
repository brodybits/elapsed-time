const childProc = require('child_process')

const fs = require('fs')

const copydir = require('copy-dir')

const DISTCHECK_ROOT = 'distcheck'

const DISTCHECK_BROWSER_ROOT = `${DISTCHECK_ROOT}/browser`

const DISTCHECK_NODE_ROOT = `${DISTCHECK_ROOT}/node`

// I/O wrapper functions with logging:

const commandSync = (c, o) => {
  console.log(`* in ${o.cwd} execute command: ${c}`)
  // FUTURE TBD change to use `commandSync` from `execa`
  // (once we drop support for some extra-old Node.js versions)
  childProc.execSync(c, o)
}

// XXX FUTURE TBD XXX
const mkdirSync = (dir) => {
  console.log(`* create directory ${dir}`)
  // XXX TBD XXX
  // FUTURE TBD use `ensureDirSync` from `fs-extra`
  // (once we drop support for some extra-old Node.js versions)
  fs.mkdirSync(dir)
}

// FUTURE TBD simply use `copySync` from `fs-extra`
// (once we drop support for some extra-old Node.js versions)

const copyDirSync = (src, dest) => {
  console.log(`* copy artifacts directory from ${src} to ${dest}`)
  copydir.sync(src, dest)
}

const copyFileSync = (src, dest) => {
  console.log(`* copy file artifact from ${src} to ${dest}`)
  // fs.copyFileSync(src, dest)
  commandSync(
    `cp ${src} ${dest}`,
    { stdio: 'inherit' })
}

// This step is done by calling rimraf in `distcheck:prepare` script:
// removeSync(DISTCHECK_ROOT)

// Separate step needed since `recursive` option is not supported on
// some old Node.js versions:
mkdirSync(DISTCHECK_ROOT)

mkdirSync(DISTCHECK_BROWSER_ROOT)

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

mkdirSync(DISTCHECK_NODE_ROOT)
copyDirSync('lib', `${DISTCHECK_NODE_ROOT}/src`)
copyDirSync('test', `${DISTCHECK_NODE_ROOT}/test`)
