import observe from './observe'
import array from './array'
const obj = {
  a: {
    m: {
      n: 5,
    },
  },
  b: 9,
  c: [1, 2, 3, 4, 5, 6, 7],
}

observe(obj)
obj.a.m.n = 8
obj.b = 10
console.log(obj.a.m.n)
console.log(obj.b)
obj.c.push(88)
obj.c.splice(5, 0, { name: '孙悟空', age: '500' })
console.log(obj.c)
obj.c[5].name = '猪八戒'
console.log(obj.c[5])
