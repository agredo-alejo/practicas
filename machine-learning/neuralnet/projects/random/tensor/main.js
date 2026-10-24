let a = nd.ones([2,2])
let b = nd.ones([2,2])
console.time('loop')
for (let index = 0; index < 1; index++) {
    nd.neg(a)
}
console.timeEnd('loop')
