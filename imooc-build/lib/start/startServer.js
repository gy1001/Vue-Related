const chokidar = require('chokidar')
const path = require('path')
const cp = require('child_process')
const log = require('../../utils/log')
const { getConfigFile } = require('../../utils')
let child
let serverArgs
function runServer(args = {}) {
  const { config = '', customWebpackPath = '', stopServer = false } = args
  // 启动 webpack 服务
  // 启动子进程的方式
  // console.log('pid', process.pid)
  // 第一中使用 exec
  // cp.exec(
  //   'node ' + path.resolve(__dirname, './devService.js'),
  //   (err, stdout, stderr) => {
  //     if (err) {
  //       console.log('error', 'err')
  //     } else {
  //       console.log('dev callback')
  //       console.log(stdout)
  //     }
  //   },
  // )
  // 第二种：使用 execFile 方式
  // cp.execFile(
  //   'node',
  //   [path.resolve(__dirname, './devService.js')],
  //   {},
  //   (err, stdout) => {
  //     if (!err) {
  //       console.log(stdout)
  //     } else {
  //       console.log(err)
  //     }
  //   },
  // )
  // 第三种：使用 spwan
  // const child = cp.spawn('node', [path.resolve(__dirname, './devService.js')])
  // // 输出相关的数据
  // child.stdout.on('data', function (data) {
  //   console.log('data from child: ' + data)
  // })

  // // 错误的输出
  // child.stderr.on('data', function (data) {
  //   console.log('error from child: ' + data)
  // })

  // // 子进程结束时输出
  // child.on('close', function (code) {
  //   console.log('child exists with code: ' + code)
  // })

  // 第四种：fork
  const srciprtPath = path.resolve(__dirname, './devService.js')
  const configParams = [
    '--port 8080',
    '--config ' + config,
    '--customWebpackPath ' + customWebpackPath,
    '--stop-server ' + (!!stopServer ? true : ''),
  ]
  child = cp.fork(srciprtPath, configParams)
  // child.on('message', (data) => {
  // 接收来自子进程中的消息
  //   console.log('-------message from child process: start---')
  //   console.log(data)
  //   console.log('-------message from child process: end---')
  // })
  // child.send('hello child process')
  child.on('exit', (code) => {
    if (code) {
      // 子进程退出时，主进程也进行关闭，比如：端口号被占用时选择了拒绝使用新端口号
      process.exit(code)
    }
  })
}

function onChange(eventName, path) {
  log.verbose('config file changed')
  log.info('config fill changed-----')
  child.kill()
  runServer(serverArgs)
}

function runWatcher(args) {
  // 启动配置监听服务
  // 使用三方库：chokidar
  let configPath
  if (args.config) {
    configPath = path.isAbsolute(args.config)
      ? args.config
      : path.resolve(args.config)
  } else {
    configPath = getConfigFile()
  }
  log.info('开始监听文件: ' + configPath)
  const watcher = chokidar
    // .watch(path.resolve(__dirname, '../start'))
    .watch(configPath)
    .on('change', onChange)
    .on('erro', (error) => {
      log.error('file watch error!:' + error)
      process.exit(1)
    })
}

module.exports = function startServer(args, opts, cmd) {
  log.level = process.env.LOG_LEVEL
  serverArgs = args
  // 1. 通过子进程启动一个 webpack-dev-server 服务
  // 1.1 子进程启动可以避免主进程收到影响
  // 1.2 子进程启动可以方便重启，解决修改配置后无法重启的问题
  runServer(args)
  // 2. 监听配置修改
  runWatcher(args)
}
