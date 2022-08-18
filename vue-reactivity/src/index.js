import observe from './observe'
const obj = {
  a: {
    m: {
      n: 5,
    },
  },
  b: 9,
}

observe(obj)
obj.a.m.n = 8
obj.b = 10
console.log(obj.a.m.n)
console.log(obj.b)
