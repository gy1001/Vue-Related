import Scanner from './Scanner'

const parseTemplateToTokens = (templateStr) => {
  const scanner = new Scanner(templateStr)
  while (scanner.pos !== templateStr.length) {
    const str1 = scanner.scanUtil('{{')
    console.log(str1)
    scanner.scan('{{')
    const str2 = scanner.scanUtil('}}')
    console.log(str2)
    scanner.scan('}}')
  }
}

export default parseTemplateToTokens
