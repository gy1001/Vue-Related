import MyMustache from './my-mustache/index.js'

var templateStr = `
  <div>
      <div class="mine">{{name}}</div>
      <div >总成绩为：{{a.b.c}}分</div>
      <ol id="me" style="color: red">
        {{#students}}
          <li>
            学生{{name}}的爱好是
            <ol>
              {{#hobbies}}
                <li>{{.}}</li>
              {{/hobbies}}
            </ol>
          </li>
        {{/students}}
      </ol>
    </div>
  `
var data = {
  name: '我是三年二班',
  a: { b: { c: 1000 } },
  students: [
    { name: '小明', hobbies: ['游泳', '健身'] },
    { name: '小哄', hobbies: ['足球', '篮球', '羽毛球'] },
    { name: '小强', hobbies: ['吃饭', '睡觉', '打豆豆'] },
  ],
}

// var templateStr = `我买了一个{{thing}},好{{mood}}啊`
// var data = {
//   thing: '华为手机',
//   mood: '开心',
// }

const result = MyMustache.render(templateStr, data)
