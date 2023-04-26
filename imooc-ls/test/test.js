var assert = require('assert')
// describe('Array', function () {
//   describe('#indexOf()', function () {
//     it('should return -1 when the value is not present', function () {
//       assert.equal([1, 2, 3].indexOf(4), -1)
//     })
//   })
// })

const parseArgs = require('../bin/parseArgs')
const getFileUser = require('../bin/getFileUser')
const getFileType = require('../bin/getFileType')
const auth = require('../bin/auth')

describe('imooc-ls', function () {
  describe('parseArgs', function () {
    it('args test', function () {
      const { args, isList, isAll } = parseArgs()
      assert.equal(isList, false)
      assert.equal(isAll, false)
      assert.equal(args.length, 1)
      assert.equal(args[0], 'test/test.js')
    })
  })

  describe('getFileUser', function () {
    it('get current user', function () {
      const stat1 = { uid: 501, gid: 20 }
      const user1 = getFileUser(stat1)
      assert.equal(user1, 'gaoyuan' + '\t' + 'staff')
    })
    it('get root user', function () {
      const stat2 = { uid: 0, gid: 0 }
      const user2 = getFileUser(stat2)
      assert.equal(user2, 'root' + '\t' + 'wheel')
    })
  })

  describe('getFileType', function () {
    it('is file', function () {
      const mode = 32768 // file
      const result = getFileType(mode)
      assert.equal(result, '-')
    })
    it('is directory', function () {
      const mode = 16384 // directory
      const result = getFileType(mode)
      assert.equal(result, 'd')
    })
    it('is link', function () {
      const mode = 40960 // link
      const result = getFileType(mode)
      assert.equal(result, 'l')
    })
    it('block device', function () {
      const mode = 24576 // block device
      const result = getFileType(mode)
      assert.equal(result, 'd')
    })
  })

  describe('getAuth', function () {
    it('user rwx------', function () {
      const mode = 4544 // user rwx
      const result = auth(mode)
      assert.equal(result, 'rwx------')
    })
    it('group ---rwx---', function () {
      const mode = 4152 // group rwx
      const result = auth(mode)
      assert.equal(result, '---rwx---')
    })
    it('other ------rwx', function () {
      const mode = 4103 // other rwx
      const result = auth(mode)
      assert.equal(result, '------rwx')
    })
    it('noe ---------', function () {
      const mode = 4096 // none rwx
      const result = auth(mode)
      assert.equal(result, '---------')
    })
    it('bad mode', function () {
      const mode = 0 // bad mode
      const result = auth(mode)
      assert.equal(result, '---------')
    })
    it('bad mode string', function () {
      const mode = 'a' // bad mode string
      const result = auth(mode)
      assert.equal(result, '---------')
    })
  })
})
