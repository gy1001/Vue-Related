import parse from './parse'

var templateString = `
  <div class="mine your" id="box" data-color="red">
    <h3>
      <span class="text">你好</span>
      <span>我是我 我是</span>
    </h3>
    <ul>
      <li>A</li>
      <li>B</li>
      <li>C</li>
    </ul>
  </div>
`

const ast = parse(templateString.trim())
console.log(ast)
