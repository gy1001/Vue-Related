const net = require('net')
const client = new net.Socket()

client.connect(8081, 'localhost', function () {
  console.log('connect successful')
})

client.on('data', (data) => {
  console.log('-------客户端接收到了服务端的数据:start--------')
  console.log(data.toString()) // 这里的data 是一个Buffer
  console.log('-------客户端接收到了服务端的数据:end--------')
  setTimeout(() => {
    console.log('客户端要给服务端发送消息了')
    client.write('hello i am clinet')
  }, 2000)
})

client.on('end', () => {
  console.log('client end')
})

client.on('error', (error) => {
  console.log('error', error)
})

setTimeout(() => {
  client.write('END')
}, 5000)
