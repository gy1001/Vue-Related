module.exports = function (api, params) {
  const Service = require('@vue/cli-service/lib/Service')
  const service = new Service(process.cwd())

  service.run('serve')
}
