// vue3 中采用的并非正则
// 对模板进行编译处理
import { parseHTML } from './parse'

export function compilerToFunction(template) {
  // 1 就是将 template 转换为 AST 语法树
  let ast = parseHTML(template)
  console.log(ast)
  // 2. 生成 render 方法，（render 方法执行返回的结果就是 虚拟 DOM）
}
