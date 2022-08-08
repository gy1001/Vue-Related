import MyMustache from './my-mustache/index.js'

var templateStr = `我买了一个{{thing}},好{{mood}}啊`
var data = {
  thing: '华为手机',
  mood: '开心',
}

const result = MyMustache.render(templateStr, data)
