import MyMustache from './my-mustache/index.js'

var templateStr = `
    <div>
      <div class="mine">{{name}}</div>
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
  name: '齐天大圣',
  students: [
    { name: '小明', hobbies: ['游泳', '健身'] },
    { name: '小红', hobbies: ['足球', '篮球', '羽毛球'] },
    { name: '小强', hobbies: ['吃饭', '睡觉'] },
  ],
}

const result = MyMustache.render(templateStr, data)
