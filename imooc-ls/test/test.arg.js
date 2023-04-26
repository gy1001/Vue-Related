var assert = require('assert')
const parseArgs = require('../bin/parseArgs')

describe('imooc-ls', function () {
  describe('parseArgs', function () {
    it('args test', function () {
      const { args, isList, isAll } = parseArgs()
      assert.equal(isList, true)
      assert.equal(isAll, true)
      assert.equal(args.length, 2)
      assert.equal(args[0], 'test/test.arg.js')
    })
  })
})
