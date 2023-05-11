const Service = require('../service/Service')
module.exports = async function build(arg, opts, cmd) {
  const args = {
    customWebpackPath: arg.customWebpackPath || '',
    stopServer: !!arg.stopServer,
  }
  process.env.NODE_ENV = 'production'
  const service = new Service('build', args)
  service.build()
}
