const childProc = require('child_process')

const fs = require('fs')

const path = require('path')

const copydir = require('copy-dir')

const DISTCHECK_ROOT = 'distcheck'

const DISTCHECK_BROWSER_ROOT = path.join(DISTCHECK_ROOT, 'browser')

const DISTCHECK_NODE_ROOT = path.join(DISTCHECK_ROOT, 'node')

// I/O wrapper functions with logging:

const commandSync = (c, o) => {
  console.log('* execure command in cwd:' + (o.cwd || process.cwd()))
  console.log('  command: ' + c)

  // FUTURE TBD change to use `commandSync` from `execa`
  // in case support for some extra-old Node.js versions is removed
  childProc.execSync(c, o)
}

// XXX FUTURE TBD XXX
const mkdirSync = (dir) => {
  console.log('* create directory: ' + dir)

  // XXX TBD XXX
  // FUTURE TBD use `ensureDirSync` from `fs-extra`
  // in case support for some extra-old Node.js versions is removed
  fs.mkdirSync(dir)
}

// FUTURE TBD simply use `copySync` from `fs-extra`
// in case support for some extra-old Node.js versions is removed

const copyDirSync = (src, dest) => {
  console.log('* copy artifacts directory')
  console.log('  from src: ' + src)
  console.log('  to dest: ' + dest)

  copydir.sync(src, dest)
}

const copyFileSync = (src, dest) => {
  console.log('* copy file artifact')
  console.log('  from src: ' + src)
  console.log('  to dest: ' + dest)

  // workaround for missing `copyFileSync` on extra-old Node.js versions
  // fs.copyFileSync(src, dest)
  commandSync(
    `cp ${src} ${dest}`,
    { stdio: 'inherit' })
}

// This step is done by calling rimraf in `distcheck:prepare` script:
// removeSync(DISTCHECK_ROOT)

// Separate step as a workaround since `recursive` option is not supported on
// some old Node.js versions:
mkdirSync(DISTCHECK_ROOT)

mkdirSync(DISTCHECK_BROWSER_ROOT)

copyDirSync('lib', path.join(DISTCHECK_BROWSER_ROOT, 'src'))
copyFileSync('lib/hrtime-browser.js', path.join(DISTCHECK_BROWSER_ROOT, 'src', 'hrtime.js'))
copyDirSync('test', path.join(DISTCHECK_BROWSER_ROOT, 'test'))
copyFileSync('karma.conf.js', path.join(DISTCHECK_BROWSER_ROOT, 'karma.conf.js'))

commandSync('npm init -y', {
  cwd: DISTCHECK_BROWSER_ROOT,
  stdio: 'inherit'
})

commandSync(
  'npm install babel-runtime@' + require('../package.json').dependencies['babel-runtime'],
  {
    cwd: DISTCHECK_BROWSER_ROOT,
    stdio: 'inherit'
  })

commandSync(
  'npm install babel-core@' + require('../package.json').devDependencies['babel-core'],
  {
    cwd: DISTCHECK_BROWSER_ROOT,
    stdio: 'inherit'
  })

mkdirSync(DISTCHECK_NODE_ROOT)
copyDirSync('lib', path.join(DISTCHECK_NODE_ROOT, 'src'))
copyDirSync('test', path.join(DISTCHECK_NODE_ROOT, 'test'))
