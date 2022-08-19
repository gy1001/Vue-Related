export default class Dep {
  constructor() {
    console.log('我是DEP类的构造器')
    // 用数组存储自己的订阅者，放的是watcher实例
    this.subs = new Set()
  }

  // 添加订阅
  addSub(sub) {
    this.subs.add(sub)
  }

  notify() {
    // 浅拷贝一份
    // 源码中使用了，浅拷贝，为什么要浅拷贝 呢？？？？？
    // const subs = this.subs.slice()
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}
