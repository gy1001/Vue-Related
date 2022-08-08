import parseTemplateToTokens from './parseTemplateToTokens.js'
import renderTemplate from './renderTemplate.js'

const MyMustache = {
  render(templateStr, data) {
    var tokens = parseTemplateToTokens(templateStr)
    // 调用 renderTemplate 函数，让tokens 数组变成 dom 字符串
    var domHtml = renderTemplate(tokens, data)
    console.log(domHtml)
  },
}
export default MyMustache
