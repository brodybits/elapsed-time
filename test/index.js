import { expect } from 'chai'

import ElapsedTime from '../src'

function sleep (timeout) {
  return new Promise((resolve) => { setTimeout(resolve, timeout) })
}

// QUICK TEST WORKAROUND SOLUTION:
const itOnLinux = (
  (process.platform === 'linux')
    ? it
    : it.skip
)
const itOnLinuxOrBrowser = (
  (process.platform === 'linux' || !process.platform)
    ? it
    : it.skip
)

describe('ElapsedTime', () => {
  let et

  beforeEach(() => {
    et = new ElapsedTime({
      formatter: (val) => { return `${val}ns` }
    })
  })

  it('static #new should return ElapsedTime instance', () => {
    et = ElapsedTime.new()
    expect(et).to.be.instanceof(ElapsedTime)
  })

  it('static #new should pass arguments to ElapsedTime constructor', () => {
    et = ElapsedTime.new({ formatter: () => { return 'h1' } }).start()
    expect(et.getValue()).to.equal('h1')
  })

  it('static #setDefaultFormatter', () => {
    et = ElapsedTime.new({ formatter: () => { return 'h1' } }).start()
    expect(et.getValue()).to.equal('h1')
    ElapsedTime.setDefaultFormatter(() => { return 'h1' })
    et = ElapsedTime.new().start()
    expect(et.getValue()).to.equal('h1')
  })

  it('#start called twice generate Error', () => {
    et.start()
    expect(et.start).to.throw(Error)
  })

  it('#pause without #start generate Error', () => {
    expect(et.pause).to.throw(Error)
  })

  it('#pause called twice generate Error', () => {
    et.start().pause()
    expect(et.pause).to.throw(Error)
  })

  it('#resume without #start generate Error', () => {
    expect(et.resume).to.throw(Error)
  })

  it('#resume without #pause generate Error', () => {
    et.start()
    expect(et.resume).to.throw(Error)
  })

  itOnLinux('#resume & #getRawValue', async () => {
    et.start()
    await sleep(10)
    et.pause()
    await sleep(10)
    et.resume()
    await sleep(10)
    expect(et.getRawValue()).to.be.within(19 * 1e6, 28 * 1e6)
  })

  itOnLinuxOrBrowser('#sleep & #getRawValue', async () => {
    et.start().sleep(10)
    await sleep(12)
    expect(et.getRawValue()).to.be.within(0, 4 * 1e6)
  })

  it('#sleep without #start generate Error', () => {
    expect(et.sleep.bind(et, 1)).to.throw(Error)
  })

  it('#sleep called twice generate Error', () => {
    et.start().sleep(1)
    expect(et.sleep.bind(et, 1)).to.throw(Error)
  })

  it('#reset & #getRawValue', async () => {
    et.start()
    await sleep(10)
    et.reset().start()
    expect(et.getRawValue()).to.be.below(1 * 1e6)
  })

  it('#getRawValue without #start generate Error', () => {
    expect(et.getRawValue).to.throw(Error)
  })

  itOnLinuxOrBrowser('#getRawValue', async () => {
    et.start()
    await sleep(10)
    expect(et.getRawValue()).to.be.within(9 * 1e6, 14 * 1e6)
    await sleep(10)
    expect(et.getRawValue()).to.be.within(19 * 1e6, 26 * 1e6)
  })

  itOnLinuxOrBrowser('#getRawValue with #pause', async () => {
    et.start()
    await sleep(10)
    et.pause()
    const value = et.getRawValue()
    expect(value).to.be.within(9 * 1e6, 14 * 1e6)
    await sleep(10)
    expect(et.getRawValue()).to.equal(value)
  })

  it('#getValue without #start generate Error', () => {
    expect(et.getValue).to.throw(Error)
  })

  itOnLinuxOrBrowser('#getValue', async () => {
    et.start()
    await sleep(10)
    const value = et.getValue()
    expect(parseInt(value.slice(0, -2), 10)).to.be.within(9 * 1e6, 14 * 1e6)
    expect(value.slice(-2)).to.equal('ns')
  })

  itOnLinuxOrBrowser('#getValue with #pause', async () => {
    et.start()
    await sleep(10)
    et.pause()
    const value = et.getValue()
    expect(parseInt(value.slice(0, -2), 10)).to.be.within(9 * 1e6, 14 * 1e6)
    expect(value.slice(-2)).to.equal('ns')
    expect(et.getValue()).to.equal(value)
  })

  it('#getValue with custom formatter', () => {
    const value = et.start().getValue({ formatter: () => { return 'h1' } })
    expect(value).to.equal('h1')
  })
})
