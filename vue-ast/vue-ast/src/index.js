// const { default: parse } = require('./parse')
import parse from './parse'

var templateString = `
  <div>
    <h3>
      <span>你好</span>
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
