const npmlog = require('npmlog')
const LOG_LEVELS = ['verbose', 'info', 'warn', 'error']
const LOG_LEVEL = process.env.LOG_LEVEL
npmlog.level = LOG_LEVELS.indexOf(LOG_LEVEL) != -1 ? LOG_LEVEL : 'info'
module.exports = npmlog
