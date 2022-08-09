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
  thing: '华为手机',
  mood: '开心',
}

const result = MyMustache.render(templateStr, data)
