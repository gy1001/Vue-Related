class Scanner {
  constructor(templateStr) {
    // 指针
    this.pos = 0
    // 未遍历的字符串，一开始就是模板字符串原文
    this.tail = templateStr
    // 要遍历的字符串
    this.templateStr = templateStr
  }

  scan(tag) {
    if (this.tail.indexOf(tag) === 0) {
      // tag 有多长，比如 {{ 长度是2，就让指针后移动几位
      this.pos += tag.length
      this.tail = this.templateStr.substring(this.pos)
    }
  }

  // 让指针进行扫描 直到遇到指定内容结束，并且能够返回结束之前路过的文字
  scanUtil(stopTag) {
    // 记录一下当前开始的位置
    var POS_BACKUP = this.pos
    // 当 未遍历的字符串不是以 stopTag 开头的时候，说明没有遍历到相应位置，就继续遍历
    while (!this.eos() && this.tail.indexOf(stopTag) !== 0) {
      this.pos++
      // 改变剩余字符串,从当前指针这个字符开始到最后的全部字符
      this.tail = this.templateStr.substring(this.pos)
    }
    // 返回当前截取到的字符串
    return this.templateStr.substring(POS_BACKUP, this.pos)
  }

  // 指针是否到头，返回布尔值
  eos() {
    return this.pos >= this.templateStr.length
  }
}

export default Scanner
