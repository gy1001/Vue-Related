// console.log('-------- dev service start ----------')
// console.log(process.argv)
// console.log(process.pid)
// console.log(process.ppid)
// console.log('-------- dev service end ----------')
// process.on('message', (data) => {
//   console.log('==========massage from main process: start=============')
//   console.log(data)
//   console.log('==========massage from main process: end================')
// })
// process.send('message from child process')

const detectPort = require('detect-port')
const inquirer = require('inquirer')
const Service = require('../service/Service')
;(async function () {
  const params = process.argv.slice(2)
  const DEFAUL_PORT = 8000
  const paramObj = {}
  params.forEach((param) => {
    const paramsArr = param.split(' ')
    paramObj[paramsArr[0].replace('--', '')] = paramsArr[1]
  })
  const defaultPort = parseInt(paramObj.port || DEFAUL_PORT, 10)
  const config = paramObj.config || ''
  try {
    const newPort = await detectPort(defaultPort)
    if (newPort === defaultPort) {
      console.log('端口号' + defaultPort + '可以使用')
    } else {
      console.log('端口号' + defaultPort + '被占用，建议使用新端口号' + newPort)
      // 命令行交互
      const questions = {
        type: 'confirm',
        name: 'answer',
        message: `${defaultPort}已被占用，是否启用新端口号${newPort}?`,
      }
      const result = await inquirer.prompt(questions)
      if (!result.answer) {
        process.exit(1)
      }
    }
    // 否则就进行下一步操作
    const args = {
      port: newPort,
      config,
      customWebpackPath: paramObj.customWebpackPath || '',
    }
    const service = new Service(args)
    service.start()
    // const net = require('net')
    // const tcpServer = new net.Server()
    // tcpServer.listen(8081, 'localhost', function () {
    //   console.log(tcpServer.address())
    // })
    // tcpServer.on('error', (err) => {
    //   console.log(err)
    // })
    // tcpServer.on('connection', (socket) => {
    //   console.log('socket链接')
    //   setTimeout(() => {
    //     socket.write('服务端向客户端写入数据')
    //   }, 2000)
    //   socket.on('data', (data) => {
    //     console.log('-------服务端接收到了客户端的数据:start--------')
    //     const commandString = data.toString()
    //     console.log(commandString)
    //     if (commandString === 'END') {
    //       socket.end()
    //     }
    //     console.log('-------服务端接收到了客户端的数据:end----------')
    //   })
    // })
  } catch (error) {
    console.log(error)
  }
})()
